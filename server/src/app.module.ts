import { Module } from '@nestjs/common';
import { ChatController } from 'modules/chat/chat-controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunityController } from './modules/community/community-controller';
import { ExpertController } from './modules/expert/expert-controller';
import { IntroController } from './modules/intro-controller';
import { LifeGraphController } from './modules/lifeGraph/life-graph-controller';
import { SimulationController } from './modules/simulation/simulation-controller';
import { UserController } from './modules/user/user-controller';

@Module({
  imports: [],
  controllers: [AppController, IntroController, UserController, SimulationController, CommunityController, ChatController, ExpertController, LifeGraphController],
  providers: [AppService],
})
export class AppModule {}
