import { GardenPlant } from './../../models/gardenPlant';
import { User } from './../../models/user';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Plant } from '../../models/plant';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiPath: String = 'http://localhost:3000/api';

  constructor( private http: Http) { }

  getAllPlants() {
    return this.http.get(this.apiPath + '/search')
      .pipe(map(res => res.json()));
  }

  addPlant(newPlant: Plant) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.apiPath + '/new_plant', newPlant, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getSowingMethodString(methodNum: number): string {
    let methodString: string;

    if (!methodNum) {
      return null;
    } else {
      switch (methodNum) {
        case 1: methodString = 'Rapid germination--less than 2 weeks at 68ºF.';
          break;
        case 2: methodString = 'Slow germination--more than 2 weeks at 68ºF.';
          break;
        case 3: methodString = 'Germination takes 3-4 weeks at 68ºF.';
          break;
        case 4: methodString = 'Keep 4-12 weeks at 40ºF, then move to 68ºF for germination.';
          break;
        case 5: methodString = 'Sow seeds at 39ºF. Germination is erratic, and can last many months.';
        break;
        case 6: methodString = 'Sow seeds at 68ºF. Germination is erratic, and can last many months.';
        break;
        case 7: methodString = 'Rapid germination. Sow seeds at 75ºF.';
          break;
        case 8: methodString = 'Keep 2-4 weeks at 68ºF, then keep 4-6 weeks at 39ºF, then move to 53ºF for germination.';
        break;
        case 9: methodString = 'Keep 2-4 weeks at 68ºF, then keep 4-6 weeks at 21ºF, then move to 53ºF for germination.';
        break;
        case 10: methodString = 'Sow outdoors in the fall for spring germination.';
        break;
        case 11: methodString = 'Keep 2-4 weeks at 68ºF, then keep 4-6 weeks at 39ºF, then move to 53ºF for germination.'
        + ' Very slow germination--may take one to two years.';
          break;
        case 12: methodString = 'Slow germination--up to a year or more. Store seeds in moist sand in the shade. '
        + 'Check seeds often in the spring, and sow them all as soon as radicals appear.';
          break;
        case 13: methodString = '6 weeks at 71ºF, then 6-8 weeks at 39ºF, then 4-6 weeks at 50ºF. Repeat cycle until seed has sprouted.';
          break;
        case 14: methodString = '4-6 days at 87ºF, 12 weeks in the dark at 35ºF. '
        + 'Slowly raise temperature and light levels until seed has sprouted.';
          break;
        case 15: methodString = 'Imprevious seed coats. Nick, grind or puncture seeds before sowing.';
          break;
        case 16: methodString = 'Pour hot water over seeds. Let soak 1-3 days until you notice the seeds swelling.';
          break;
        case 17: methodString = 'Wash and rinse seeds 3 times per day for 1 to 2 weeks.';
          break;
      }

      return methodString;
    }
  }

  getStageString(stage: number): string {
    let stageString: string;

    switch (stage) {
      case 1: stageString = 'Seed';
        break;
      case 2: stageString = 'Sproutling';
        break;
      case 3: stageString = 'Young Plant';
        break;
      case 4: stageString = 'Mature Plant';
        break;
    }

    return stageString;
  }
}
