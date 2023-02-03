import { BadGatewayException, Injectable } from '@nestjs/common';

import { CaptureSearchersService } from 'src/modules/capture-searchers/capture-searchers.service';

import { CarInterface } from '../../car/interface/car.interface';
import { CacheService } from 'src/services/Cache.service';

@Injectable()
export class SearchService {
  constructor(
    private captureSearchers: CaptureSearchersService,
    private cacheService: CacheService,
  ) {}

  async search(query): Promise<CarInterface[] | unknown> {
    try {
      let { search } = query;

      search = search.replace('+', ' ');

      /**
       *  Validar se eu tenho os dados no banco de dados sobre os carros
       *
       *  se nao adiciona na fila para reconhecer os dados
       *
       */

      return await this.captureSearchers.addValueInQueue(search);
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
}
