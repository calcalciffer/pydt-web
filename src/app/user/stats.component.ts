import { Component, OnInit } from '@angular/core';
import { UserService } from 'pydt-shared';
import { Utility } from '../shared/utility';

@Component({
  selector: 'pydt-user-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class UserStatsComponent implements OnInit {
  tableColumns: Array<any> = [
    { title: 'Rank', name: 'rank', sort: false },
    { title: 'Player', name: 'player', className: 'cursor-pointer', filter: true },
    { title: 'Active Games', name: 'activeGames', className: 'cursor-pointer' },
    { title: 'Total Games', name: 'totalGames', className: 'cursor-pointer' },
    { title: 'Turns Played', name: 'turnsPlayed', className: 'cursor-pointer', sort: 'desc' },
    { title: 'Avg Turn Time', name: 'avgTurnTime', className: 'cursor-pointer' },
    { title: '< 1 hour', name: 'fastTurns', className: 'cursor-pointer text-success' },
    { title: '> 6 hours', name: 'slowTurns', className: 'cursor-pointer text-danger' }
  ];
  tableConfig = {
    columns: this.tableColumns,
    sorting: { columns: this.tableColumns },
    filtering: { filterString: '', filteredResults: 0 },
    className: ['table', 'table-condensed', 'table-striped'],
    paging: { page: 1, itemsPerPage: 25 }
  };
  rawData: Array<any> = [];
  visibleData: Array<any> = [];

  constructor(private userApi: UserService) {
  }

  ngOnInit() {
    this.userApi.all().subscribe(users => {
      this.rawData = users.map(user => {
        const avgTurnTime = user.timeTaken / (user.turnsPlayed + user.turnsSkipped);
        const activeGames = (user.activeGameIds || []).length;

        return {
          rank: '',
          steamId: user.steamId,
          player: `<a href="https://steamcommunity.com/profiles/${user.steamId}" target="_steamprofile">
            <img src="${user.avatarSmall}">
          </a> ${user.displayName}`,
          player_sort: user.displayName.toLowerCase(),
          activeGames: activeGames,
          totalGames: activeGames + (user.inactiveGameIds || []).length,
          turnsPlayed: user.turnsPlayed,
          avgTurnTime: Utility.countdown(0, avgTurnTime),
          avgTurnTime_sort: avgTurnTime,
          fastTurns: user.fastTurns,
          slowTurns: user.slowTurns
        };
      });

      this.onChangeTable(this.tableConfig, this.rawData, this.visibleData);
    });
  }

  onChangeTable(tableConfig: any, rawData: Array<any>, visibleData?: Array<any>, page?: any): any {
    Utility.onChangeTable(tableConfig, rawData, visibleData, page);
  }
}
