import { BadGatewayException, Injectable } from '@nestjs/common';
import { MercadoLivreService } from './services/MercadoLivre.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AnnoncementsModel } from 'src/model/Announcements.entity';
import { Repository } from 'typeorm';
import { AnnoncementsService } from '../annoncements/annoncements.service';

@Injectable()
export class WebsitesService {
  constructor(
    @InjectRepository(AnnoncementsModel) private readonly adModel: Repository<AnnoncementsModel>,
    private mercadoLivreService: MercadoLivreService,
  ) {}

  async loadAllWebSitesServices(value: string): Promise<any> {
    try {
      const mercadolivre = await this.mercadoLivreService.load(value);
      const olx = /* await this.OlxService.load(value) */ [];
      const data = [...mercadolivre, ...olx];

      const announcementsSaved = await this.saveAnnouncements(data);
      return announcementsSaved;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async saveAnnouncements(data: any[]): Promise<any> {
    try {
      const preparedData = data.map(val => {
        if (!val.href_announcements) {
          val.href_announcements = 'without_href';
        }
        if (!val.image_href) {
          val.image_href = 'without_href';
        }
        return val;
      });

      const result = await this.adModel.insert(preparedData);
      return result;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
}

