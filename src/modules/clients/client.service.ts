import { ClientRepository } from './client.repository';

export class ClientService {
  constructor(private readonly repository: ClientRepository) {}
}
