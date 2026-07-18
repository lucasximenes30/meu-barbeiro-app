import { SettingRepository } from './setting.repository';

export class SettingService {
  constructor(private readonly repository: SettingRepository) {}
}
