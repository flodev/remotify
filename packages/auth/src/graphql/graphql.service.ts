import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GraphqlService {
  constructor(private httpService: HttpService) {}
}
