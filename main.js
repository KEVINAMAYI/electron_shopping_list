const electron = require('electron');
const url = require('url');
const path = require('path');
const { platform } = require('os');

const {app,BrowserWindow,Menu,ipcMain} = electron;

//set environment
// process.env.NODE_ENV = 'prodution';

let mainWindow;
let addWindow;

//listen to the app if ready
app.on('ready', function(){

    //create a new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    //load html file into window
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname,'mainWindow.html'),
        protocol:'file:',
        slashes:true
    }));


    mainWindow.on('closed',function(){
        app.quit();
    });

   const mainMenu = Menu.buildFromTemplate(menuWindow);

   Menu.setApplicationMenu(mainMenu);

});

//handle create add window
function createAddWindow(){

     //create a new window
     addWindow = new BrowserWindow({
         width:300,
         height:200,
         title:'Add Shopping Item',
         webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
     });

     //load html file into window
     addWindow.loadURL(url.format({
         pathname:path.join(__dirname,'addWindow.html'),
         protocol:'file:',
         slashes:true
     }));

     addWindow.on('close',function(){
        
        addWindow = null;

     });


}

//catch item:add
ipcMain.on('item:add',function(e,item){

    mainWindow.webContents.send('item:add',item);
    addWindow.close();

});

//create menu tempalate
const menuWindow = [
{
    label:'file',
    submenu:[
    {
        label:'Add Item',
        click(){
            createAddWindow();
        }
    },
    {
        label:'Clear Items',
        click(){

            mainWindow.webContents.send('item:clear');
        }
    },
    {
        label:'quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
            app.quit();
        }
    }
]
}
];

//add empty object on a mac
if(process.platform == 'darwin'){
    menuWindow.unshift({});
}

//add developers tools if not in production
if(process.env.NODE_ENV !== 'production'){
    menuWindow.push({
        label:'Developer Tools',
        submenu:[{
            label:'Toggle Developer Tools',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            click(item,focusedWindow){
                focusedWindow.toggleDevTools();

            },
        },
        {
            role:'reload'

        }
    ]


    });
}