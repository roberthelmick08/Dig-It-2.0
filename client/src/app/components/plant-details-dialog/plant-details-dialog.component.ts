import { AuthenticationService } from './../../services/authentication.service';
import { User } from './../../../models/user';
import { ReminderService } from './../../services/reminder.service';
import { DataService } from './../../services/data.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Plant } from 'src/models/plant';

@Component({
  selector: 'app-plant-details-dialog',
  templateUrl: './plant-details-dialog.component.html',
  styleUrls: ['./plant-details-dialog.component.scss']
})
export class PlantDetailsDialogComponent {
  user: User;
  plant: Plant;
  // Variable used to navigate to next plant details page
  step: number = 0;
  isImageLoaded: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<PlantDetailsDialogComponent>,
  public dataService: DataService, private auth: AuthenticationService, public reminderService: ReminderService) {
    this.plant = data.plant;
    this.user = data.user;
    this.imageSearchByName();
  }

  imageSearchByName(isRecurse?: boolean) {
    let queryString;

    if (!this.plant.botanicalName || isRecurse === true) {
      queryString = this.plant.commonName.toLocaleLowerCase().split(' ').join('_');
    } else {
      queryString = this.plant.botanicalName.toLocaleLowerCase().split(' ').join('_');
    }

    this.auth.doCORSRequest({
      method: 'GET',
      url: 'https://commons.wikimedia.org/w/api.php?action=query&generator=images&prop=imageinfo&gimlimit=1&redirects=1&titles=' + queryString + '&iiprop=url&format=json'
    }).subscribe( result => {
      result = JSON.parse(result);
      if (result.query) {
        this.plant.img = result.query.pages[Object.keys(result.query.pages)[0]].imageinfo[0].url;
        this.isImageLoaded = true;
      }
    }, (err) => {
      this.dataService.openSnackBar('fail');
      console.error(err);
    }, () => {
      if (!this.plant.img && !isRecurse) {
        this.imageSearchByName(true);
      }
    });
  }

  onNextStep() {
    this.step++;
  }

  onPreviousStep() {
    this.step--;
  }

  toSentenceCase(text: string) {
    if (text) {
      let sentenceArray = text.trim().split('. ');
      sentenceArray = sentenceArray.map( sentence => {
        const charArray = sentence.split('');
        charArray[0] = charArray[0].toUpperCase();
        if (charArray[charArray.length - 1] !== '.') {
          charArray.push('.');
        }
        return charArray.join('');
      });
      return sentenceArray.join(' ');
    }
  }

  getTooltipText(type: string, value?: string): string {
    let innerHtml = 'An error has occurred';

    if (type === 'sunSchedule') {
      if (value === 'Full Sun') {
        innerHtml = 'Full Sun means the plant requires at least 6 hours of direct sunlight per day. These plants are more heat tolerant.';
      } else if (value === 'Partial Sun') {
        innerHtml = 'Partial Sun means the plant requires 3 to 6 hours of direct afternoon sunlight per day. These plants tend to be more heat tolerant.';
      } else if (value === 'Partial Shade') {
        innerHtml = 'Partial Sun means the plant requires 3 to 6 hours of direct morning sunlight per day. Since these plants are less heat tolerant, they should be shielded from the harsh afternoon sun.';
      } else if (value === 'Full Shade') {
        innerHtml = 'Full Shade means the plant can survive on less than 3 hours of direct sunlight each day. They enjoy filtered sunlight during the rest of the day.';
      }
    } else if (type === 'lifeType') {
      if (value === 'Annual') {
        innerHtml = 'The lifecycle of an annual plant is one year. They will germinate, bloom and die in one growing season.';
      } else if (value === 'Biennial') {
        innerHtml = 'The lifecycle of a biennial plant is two years. They will germinate and grow the first season, survive one winter in a dormant state, and the second growing season it will grow more, bloom and die in one season.';
      } else if (value === 'Perennial') {
        innerHtml = 'The lifecycle of a perennial plant is indefinite. They will continue to grow year after year.';
      }
    } else if (type === 'harvestDate') {
      innerHtml = 'This is an approximate date calculated by Dig-It based on the plant type and the climate in your location. This should only act as a guide, and Dig-It recommends that you research what to look for to tell that the plant is ripe before harvesting';
    }
    return innerHtml;
  }
}
