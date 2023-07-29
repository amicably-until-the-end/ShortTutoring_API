import { Controller } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Simulation')
@Controller('simulation')
export class SimulationController {
  constructor(private readonly testService: SimulationService) {}
}
