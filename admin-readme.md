# Admin Data App
A windows desktop application for managing the mobile data entry app.

## Download and Install 
#### Pre-requisites
- Enable developer mode on windows settings.
    * Navigate to windows settings.
    * Search Developer Settings.
    * Turn on `Developer Mode` using the slider.

#### Installation 
- Navigate to the app's [google drive releases](https://drive.google.com/drive/folders/1H68mM3z6rLNothsX0a08Foxw_v3pFSUH?usp=sharing) master folder.
- Download the most recent version's folder.
- Unzip the folder and open it.
- Right click on the `Install` or `Install.ps1` and click run with powershell.
- This installation process is command line based so you will be prompted to authorize & accept some installation steps. You can press `a` when prompted (meaning: Yes to All option). 

> You will also be prompted to press enter a few times and / or enable some settings in windows settings. Follow the prompts accordingly.

- Once installed, you can search for admin in windows search and if the above was done correctly, you will be able to launch the app.

## How to Use App:
### Features

#### Login
The first thing you see when you launch the app is a login screen. For security purposes, there is no way to sign up for an account on the admin app, so you will be given a username and password if you are authorized to use this app.

#### Dashboard
The dashboard has many useful functionalities that help manage the mobile app:

- Display total Turtle, Snake & Lizard data entries.
- Display a list of all data entries, clicking on a data entry will direct you to the data entry screen.
- Display a list of all accounts on the mobile app.
- Ability to update passwords and delete accounts.
- Display a list of all data entry fields displayed to mobile app users.
- Ability to delete data fields and save updates.    
- Display a list of categories and edit category names, delete categories or add new categories.

#### Data Entry
Clicking on a data entry from the dashboard directs the user to this screen. This screen adds the following functionalities: 

- Updating a submitted data entry.
- Deleting a submitted data entry.
- Exporting a submitted data entry as csv and uploading it to google drive with its linked images.

## Guides
This section is intended to help users navigate the app and fallback to it if they are facing any problems.

### Account Management
The [dashboard](#dashboard) has an account section under the total entries of each category. There are 4 buttons on each account entry: 

**Update Password:** 

- Pressing this button displays a prompt for the new password you intend to assign that account.  
- User is expected to type the new password in the `Password` text box and click `Submit` to save changes or `Cancel` to abort password change.
- New password is effective on submission.

**Delete Account:**

- Pressing this button prompts the user for deletion confirmation.
- The user can press `Cancel` to keep the account or `Confirm` to delete the account.
- Deletion is effective on confirmation. 

**Give/Revoke Read Permission:**

Each user on the mobile app can have read permissions, which unlocks Data retrieval functionality using `Search`.

- This button's text, color and functionality is dependent on the user's current permissions' status. 
- Clicking the button when it's displaying `Give Read Permissions` will grant the user the read permission, otherwise the user already had the permission and clicking the button will revoke it.
- Permission change is effective on click.

**Give/Revoke Write Permission:** 

Each user on the mobile app can have write permissions, which unlocks Data entry functionality.

- This button's text, color and functionality is dependent on the user's current permissions' status. 
- Clicking the button when it's displaying `Give Write Permissions` will grant the user the write permission, otherwise the user already had the permission and clicking the button will revoke it.
- Permission change is effective on click.

### Data Entry Management
The data entry screen on both the mobile app and the admin app are controlled by the database, which allows this app to manipulate the data input fields and categories and send new updates to the mobile app.

### Data Input Field Management
The dashboard displays all the data input filelds by category under the accounts list. Each field has 2 buttons: 

**Edit Field:**

- Currently not functional.

**Delete Field:** 

- Pressing this button prompts the user for deletion confirmation.
- The user can press `Cancel` to keep the field or `Confirm` to delete the field.
- Deletion is effective on [`Save Changes Button`](#save-changes-button) button press. 

#### Category Management
The dashboard displays a category list under the list of entries on the right side of the screen. Each category has 2 buttons: 

**Edit:**

- Pressing that button prompts the user to enter a new name for the category.
- The user is expected to enter a new category name and press `Submit` to confirm the name change then press `Save Changes` and confirm changes upload, otherwise no changes will be made to the category.
- Edits are effective on [`Save Changes Button`](#save-changes-button) press.

**Delete:**

- Pressing this button prompts the user for deletion confirmation.
- The user can press `Cancel` to keep the category or `Confirm` to delete the category.

> Edits & Deletion is effective on [`Save Changes Button`](#save-changes-button) button press. 

#### Save Changes Button
- Press the `Save Changes` button on the top right for field management and/or category management changes to take effect.
- Any field deletions confirmed without saving the changes will not take effect for the mobile users. 
- Any category name changes, category deletions and/or deletions confirmed without saving the changes will not take effect for the mobile users. 
