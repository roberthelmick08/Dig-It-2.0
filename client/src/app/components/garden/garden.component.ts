import { GardenPlant } from './../../../models/gardenPlant';
import { AuthenticationService } from './../../services/authentication.service';
import { Plant } from './../../../models/plant';
import { DataService } from './../../services/data.service';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { User } from 'src/models/user';

@Component({
  selector: 'app-garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.scss']
})
export class GardenComponent implements OnInit {

  user: User;

  @Output()
  openPlantDetailsDialogEvent = new EventEmitter();

  constructor(private dataService: DataService, public authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.user = user;
    }, (err) => {
      console.error(err);
    });
  }

  markReminderDone(plant, reminder) {
    plant.reminders.splice(plant.reminders.findIndex(r => reminder === r), 1);
    this.authService.updateUser(this.user).subscribe( data => {
    });
  }

  openPlantDetailsDialog(plant: Plant) {
    this.openPlantDetailsDialogEvent.emit(plant);
  }

  removePlantFromGarden(plant: GardenPlant) {
    this.user.garden.splice(this.user.garden.findIndex(p => plant === p), 1);
    this.authService.updateUser(this.user).subscribe( data => {
    });
  }
}
