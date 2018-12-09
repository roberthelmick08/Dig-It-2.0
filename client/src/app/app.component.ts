import { ReminderService } from './services/reminder.service';
import { DataService } from './services/data.service';
import { LoginDialogComponent } from './components/login/login.component';
import { PlantDetailsDialogComponent } from './components/plant-details-dialog/plant-details-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthenticationService } from './services/authentication.service';
import { EditProfileDialogComponent } from './components/edit-profile/edit-profile.component';
import { User } from 'src/models/user';
import { SearchComponent } from './components/search/search.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isUserMenuOpen: boolean = false;

  currentPage: string;

  user: User;

  @ViewChild(SearchComponent) searchComponent;

  constructor( public dialog: MatDialog, public authService: AuthenticationService, public dataService: DataService, public reminderService: ReminderService) {
    this.currentPage = authService.isLoggedIn() ? 'garden' : 'home';
  }


ngOnInit(): void {
  let today = new Date();

  if (this.authService.isLoggedIn() === true) {
    this.authService.getUser().subscribe(user => {
      this.user = user;
    }, (err) => {
      console.error(err);
      this.dataService.openSnackBar('fail');
    }, () => {
    // Reset annual reminders if older than 60 days
    for (let plant of this.user.garden) {
      this.dataService.imageSearchByName(plant);
      let tempPlant =  plant.reminders.filter(reminder => {
        return (reminder.name === 'move-inside' || reminder.name === 'move-outside' || reminder.name === 'repot') && new Date(reminder.date) < this.reminderService.addDays(today, -60);
      });
      tempPlant.map(reminder => {
        reminder.date = this.reminderService.addDays(reminder.date, 365);
      });
    }

    // Refresh frost dates if passed
    if (new Date(this.user.lastFrostDate) < this.reminderService.addDays(today, -30)) {
      this.user.lastFrostDate = this.reminderService.addDays(this.user.lastFrostDate, 365);
    } else if (new Date(this.user.firstFrostDate) < this.reminderService.addDays(today, -30)) {
      this.user.firstFrostDate = this.reminderService.addDays(this.user.firstFrostDate, 365);
    }
    this.authService.updateUser(this.user).subscribe();
    });
  }
}

  setCurrentPage(page: string) {
    this.currentPage = page;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  openPlantDetailsDialog(data) {
    const dialogRef = this.dialog.open(PlantDetailsDialogComponent, {
      height: window.innerWidth <= 600 ? '100vh' : '500px',
      width: window.innerWidth <= 600 ? '100vw' : '700px',
      panelClass: 'dialog-container',
      data: data
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.plant) {
        this.searchComponent.openAddToGardenDialog(data.plant);
      }
    });
  }

  openEditProfileDialog() {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      height: '450px',
      width: window.innerWidth <= 600 ? '100vw' : '700px',
      panelClass: ['dialog-container', 'remove-bottom-padding'],
      data: this.user,
    });

    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.isLogout) {
        this.onLogout();
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.currentPage = 'home';
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      height: '400px',
      width: window.innerWidth <= 600 ? '100vw' : '700px',
      panelClass: ['dialog-container', 'remove-bottom-padding']
    });

    dialogRef.afterClosed().subscribe(() => { }, (err) => {}, () => {
      if (this.authService.isLoggedIn() === true) {
        this.currentPage = 'garden';
      }
    });
  }
}
