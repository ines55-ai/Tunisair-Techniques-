import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgentsModule } from './agents/agents.module';
import { BureauxModule } from './bureaux/bureaux.module';
import { CategoriesModule } from './categories/categories.module';
import { MaterielsModule } from './materiels/materiels.module';
import { MouvementsModule } from './mouvements/mouvements.module';
import { InventairesModule } from './inventaires/inventaires.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RapportsModule } from './rapports/rapports.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    AgentsModule,
    BureauxModule,
    CategoriesModule,
    MaterielsModule,
    MouvementsModule,
    InventairesModule,
    DashboardModule,
    RapportsModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
