import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpertController } from './modules/expert/expert-controller';
import { LifeGraphController } from './modules/lifeGraph/life-graph-controller';
import { UserController } from './modules/user/user-controller';
import { SimulationController } from './modules/simulation/simulation-controller';
import { CommunityController } from './modules/community/community-controller';
import { ChatController } from 'modules/chat/chat-controller';
import { IntroController } from './modules/intro-controller';

@Module({
  imports: [],
  controllers: [AppController, IntroController, UserController, SimulationController, CommunityController, ChatController, ExpertController, LifeGraphController],
  providers: [AppService],
})
export class AppModule {}
