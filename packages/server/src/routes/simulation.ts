import { FastifyInstance } from 'fastify';
import { 
  SimulateRequestSchema, 
  AssetClass, 
  SimulationMode 
} from '@shared';
import { simulateRetirement, MonthlyReturns } from '../engine/simulator';
import { generateRandomMonthlyReturn } from '../engine/helpers/returns';
import { runMonteCarlo } from '../engine/monteCarlo';

export default async function simulationRoutes(fastify: FastifyInstance) {
  fastify.post('/simulate', async (request, reply) => {
    const parseResult = SimulateRequestSchema.safeParse(request.body);
    
    if (!parseResult.success) {
      console.error('Validation Error Details:', JSON.stringify(parseResult.error.format(), null, 2));
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid simulation configuration',
          details: parseResult.error.issues.map((i: any) => ({
            path: i.path.join('.'),
            message: i.message
          }))
        }
      });
    }

    const { config } = parseResult.data;

    if (config.mode === SimulationMode.MONTE_CARLO) {
      if (!config.monteCarlo) {
        return reply.status(400).send({
          error: {
            code: 'MISSING_MC_CONFIG',
            message: 'Monte Carlo configuration is required for MC mode'
          }
        });
      }
      const result = await runMonteCarlo(config as any);
      return result;
    }

    // Manual mode
    const { durationMonths } = config.calendar;
    const returns: MonthlyReturns[] = [];
    for (let m = 0; m < durationMonths; m++) {
      returns.push({
        [AssetClass.STOCKS]: generateRandomMonthlyReturn(
          config.portfolio.assumptions.annualExpectedReturn[AssetClass.STOCKS] || 0.08,
          config.portfolio.assumptions.annualVolatility?.[AssetClass.STOCKS] || 0.18
        ),
        [AssetClass.BONDS]: generateRandomMonthlyReturn(
          config.portfolio.assumptions.annualExpectedReturn[AssetClass.BONDS] || 0.04,
          config.portfolio.assumptions.annualVolatility?.[AssetClass.BONDS] || 0.06
        ),
        [AssetClass.CASH]: generateRandomMonthlyReturn(
          config.portfolio.assumptions.annualExpectedReturn[AssetClass.CASH] || 0.02,
          config.portfolio.assumptions.annualVolatility?.[AssetClass.CASH] || 0.01
        ),
      } as MonthlyReturns);
    }

    const result = simulateRetirement(config as any, returns, 'todo-hash', 'manual');
    return result;
  });
}
