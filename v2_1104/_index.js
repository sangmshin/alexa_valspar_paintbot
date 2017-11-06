const Alexa = require('alexa-sdk');
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeImage = Alexa.utils.ImageUtils.makeImage;
const ImageUtils = require('alexa-sdk').utils.ImageUtils;
const TextUtils = require('alexa-sdk').utils.TextUtils;


var APP_ID = "amzn1.ask.skill.2c3045b3-2955-42cb-8d70-84d7a2882510"; // TODO replace with your app ID (OPTIONAL).



// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

const languageStrings = {
    'en': {
        'translation': {
            'WELCOME' : "Welcome to Paintbot.",
            'HELP'    : "Picking a paint depends on the painter. So, let’s start with a few questions. When you’re about to start a project, do you jump right in, or would you rather hide under the bed?",
            'STOP'    : "Okay, see you next time!"
        }
    }
};
const data = {
    "city"        : "New York",
    "state"       : "NY",
    "postcode"    : "10001",
    "restaurants" : [
        { "name":"Zeke's Place",
            "address":"66 East Main Street", "phone": "978-283-0474",
            "meals": "breakfast, lunch",
            "description": "A cozy and popular spot for breakfast.  Try the blueberry french toast!"
        },
        { "name":"Morning Glory Coffee Shop",
            "address":"25 Western Avenue", "phone": "978-281-1851",
            "meals": "coffee, breakfast, lunch",
            "description": "A homestyle diner located just across the street from the harbor sea wall."
        },
        { "name":"Sugar Magnolias",
            "address":"112 Main Street", "phone": "978-281-5310",
            "meals": "breakfast, lunch",
            "description": "A quaint eatery, popular for weekend brunch.  Try the carrot cake pancakes."
        },
        { "name":"Seaport Grille",
            "address":"6 Rowe Square", "phone": "978-282-9799",
            "meals": "lunch, dinner",
            "description": "Serving seafood, steak and casual fare.  Enjoy harbor views on the deck."
        },
        { "name":"Latitude 43",
            "address":"25 Rogers Street", "phone": "978-281-0223",
            "meals": "lunch, dinner",
            "description": "Features artsy decor and sushi specials.  Live music evenings at the adjoining Minglewood Tavern."
        },
        { "name":"George's Coffee Shop",
            "address":"178 Washington Street", "phone": "978-281-1910",
            "meals": "coffee, breakfast, lunch",
            "description": "A highly rated local diner with generously sized plates."
        },

    ],
    "attractions":[
        {
            "name": "Whale Watching",
            "description": "Gloucester has tour boats that depart twice daily from Rogers street at the harbor.  Try either the 7 Seas Whale Watch, or Captain Bill and Sons Whale Watch. ",
            "distance": "0"
        },
        {
            "name": "Good Harbor Beach",
            "description": "Facing the Atlantic Ocean, Good Harbor Beach has huge expanses of soft white sand that attracts hundreds of visitors every day during the summer.",
            "distance": "2"
        },
        {
            "name": "Rockport",
            "description": "A quaint New England town, Rockport is famous for rocky beaches, seaside parks, lobster fishing boats, and several art studios.",
            "distance": "4"
        },
        {
            "name": "Fenway Park",
            "description": "Home of the Boston Red Sox, Fenway park hosts baseball games From April until October, and is open for tours. ",
            "distance": "38"
        }
    ]
}

const SKILL_NAME = "HGTV + Valspar Alexa Paintbot. ";

// Weather courtesy of the Yahoo Weather API.
// This free API recommends no more than 2000 calls per day

// const myAPI = {
//     host: 'query.yahooapis.com',
//     port: 443,
//     path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
//     method: 'GET'
// };
// 2. Skill Code =======================================================================================================


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    alexa.APP_ID = APP_ID;
    ///alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var yesIntent_usage = 0;
var homeImgNumber = 0;


const handlers = {
    'LaunchRequest': function () {

        homeImgNumber = 0;
        
        const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
        
        let template = builder.setTitle('HGTV + Valspar').setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/welcome_bg.jpg')).setTextContent(makePlainText('Hello! Welcome to Paintbot.')).setBackButtonBehavior("HIDDEN").build();
        
        var say = "Welcome to Paintbot. Picking a paint depends on the painter. So, let’s start with a few questions. When you’re about to start a project, do you jump right in, or would you rather hide under the bed?";
        var resay = "When you’re about to start a project, do you jump right in, or would you rather hide under the bed?";

        this.response.speak(say).listen(resay).renderTemplate(template);
        this.emit(':responseReady');

    },
    
    'JumpRightIn_Intent': function () {

        const builder = new Alexa.templateBuilders.BodyTemplate3Builder();
        
        let template = builder.setTitle('HGTV + Valspar').setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/welcome_bg.jpg')).setTextContent(makePlainText('')).setBackButtonBehavior("HIDDEN").build();
        
        var say = 'Okay, and do you have a good idea of what you want your room to look like? Say Yes or no?';
        var resay = 'Do you have a good idea of what you want your room to look like? Say Yes or no?';
        
        this.response.speak(say).listen(resay).renderTemplate(template);
        
        this.emit(':responseReady');
    },
    
    'AMAZON.YesIntent': function () {
        
        const builder = new Alexa.templateBuilders.BodyTemplate1Builder();

        let template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/unique_calm.jpg')).setBackButtonBehavior("HIDDEN").build();

        var say = 'Got it. And do you want your home to feel more bold and unique or calm and coordinated?';
        var resay = 'Bold and unique or calm and coordinated?';

        if(yesIntent_usage == 0){
            
            this.response.speak(say).listen(resay).renderTemplate(template);
            yesIntent_usage = 1;
            
            
        }else if (yesIntent_usage == 1){
            
            say = 'Here, check out some of these bold color palettes from Valspar.<break time="1s"/> Please choose one.'; 
            template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/colors.jpg')).setBackButtonBehavior("HIDDEN").build();
            
            this.response.speak(say).listen(resay).renderTemplate(template);
            yesIntent_usage = 2;
            
        }else if (yesIntent_usage == 2){
            
            say = 'Great. You can find it at Lowes. Here’s the one closest to you. I’ll text you the address. Would you like a coupon too?'; 
            template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/lowes.jpg')).setBackButtonBehavior("HIDDEN").build();
            
            this.response.speak(say).listen(resay).renderTemplate(template);
            yesIntent_usage = 3;
            
        }else if (yesIntent_usage == 3){
            
            say = 'Okay. When you get to Lowe’s you’ll find the Valspar paint in aisle fourteen. Now go out there and get painting.'; 
            template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/coupon.jpg')).setBackButtonBehavior("HIDDEN").build();
            // template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/cans.jpg')).setBackButtonBehavior("HIDDEN").build();
            
            this.response.speak(say).renderTemplate(template);
            yesIntent_usage = 1;
            
        }
        
        this.emit(':responseReady');
        
    },
    
    'BoldUnique_Intent': function () {

        // var onScreen;
        // onScreen = generateScreen();
        
        // var say = 'Good choice. Last question for you. Take a look at the screen — which of these homes puts the biggest smile on your face?';
        
        // this.response.cardRenderer(onScreen.title, onScreen.body, onScreen.image);
        // this.response.speak(say).listen(say);
        // this.emit(':responseReady');




            if(supportsDisplay.call(this)||isSimulator.call(this)) {
        
            var content = {
                "hasDisplaySpeechOutput" : "Good choice. Last question for you. Take a look at the screen — which of these homes puts the biggest smile on your face?",
                "hasDisplayRepromptText" : "which of these homes puts the biggest smile on your face?",
                "screenTitle": "HGTV + Valspar",
                "simpleCardTitle" : 'HGTV',
                "templateToken" : "homeImages",
                "askOrTell" : ":ask",
                "sessionAttributes": {}
            };

            renderTemplate.call(this, content);

            } else {
            // Just use a card if the device doesn't support a card.
            // this.response.cardRenderer(this.t('SKILL_NAME'), randomFact);
            var say = "Good choice. Last question for you. Take a look at the screen — which of these homes puts the biggest smile on your face?";
            var resay = "Which of these homes puts the biggest smile on your face?";
            
            this.response.speak(say).listen(resay);
            this.emit(':responseReady');
            }

    },

    'HomeOne_Intent': function () {

        const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
        
        let template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/home1_full.jpg')).setBackButtonBehavior("HIDDEN").build();

        var say = '<say-as interpret-as="interjection">yay</say-as>. Based on your answers, it looks like you’re a real Rebel with a Roller. You don’t follow trends, you make your own. - That means Valspar is the right paint for you. <break time="1s"/> Would you like to see some of our color palettes for inspiration?';
        var resay = 'Would you like to see some of our color palettes for inspiration?';
        
        // this.response.cardRenderer(onScreen.title, onScreen.body, onScreen.image);
        // this.response.speak(say).listen(say);
        this.response.speak(say).listen(resay).renderTemplate(template);
        this.emit(':responseReady');
    },

    'Strawberry_Intent': function () {

        const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
        
        let template = builder.setTitle('Whipped Strawberry').setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/strawberry.jpg')).setTextContent(makePlainText('Would you like to buy this paint?')).setBackButtonBehavior("HIDDEN").build();
        
        // var onScreen;
        // onScreen = generateScreen_homeOne();

        var say = 'Whipped Strawberry. Sounds delicious. Would you like to buy this paint?';
        
        // this.response.speak(say).listen(say).cardRenderer('Valspar Vibrant Reds', 'Whipped Strawberry', {
        //     smallImageUrl: 'https://s3.amazonaws.com/deutscherlookup/strawberry.jpg',
        //     largeImageUrl: 'https://s3.amazonaws.com/deutscherlookup/strawberry.jpg'
        // });
        this.response.speak(say).listen(say).renderTemplate(template);
        this.emit(':responseReady');
    },

    'Calm_Intent': function () {


            if(supportsDisplay.call(this)||isSimulator.call(this)) {
        
            var content = {
                "hasDisplaySpeechOutput" : "Good choice. Last question for you. Take a look at the screen — which of these homes puts the biggest smile on your face?",
                "hasDisplayRepromptText" : "which of these homes puts the biggest smile on your face?",
                "screenTitle": "HGTV + Valspar",
                "simpleCardTitle" : 'HGTV',
                "templateToken" : "homeImages",
                "askOrTell" : ":ask",
                "sessionAttributes": {}
            };

            renderTemplate.call(this, content);

            } else {
            // Just use a card if the device doesn't support a card.
            // this.response.cardRenderer(this.t('SKILL_NAME'), randomFact);
            var say = "Welcome to Paintbot. Picking a paint depends on the painter. So, let’s start with a few questions. When you’re about to start a project, do you jump right in, or would you rather hide under the bed?";
            
            this.response.speak(say).listen(say);
            this.emit(':responseReady');
            }
    },

    'ElementSelected': function () {
        const token = this.event.request.token; // the token of 
        // this.emit(':tell', 'you clicked on an element with token ' + token);
        // this.response.speak('You selected Home 1');
        this.emit('HomeOne_Intent')
    },

    'NextImg_Intent': function () {
        
        var onScreen;
        onScreen = generateScreen();
        
        var say = onScreen.title;
        
        if(homeImgNumber == 8){
            homeImgNumber = 0;
        }

        this.response.cardRenderer(onScreen.title, onScreen.body, onScreen.image);
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
        
    },

    // 'LastImg_Intent': function () {
        
    //     var onScreen;
    //     onScreen = generateScreen();
        
    //     var say = 'Good choice. Last question for you. Take a look at the screen — which of these homes puts the biggest smile on your face?';
        
    //     this.response.cardRenderer(onScreen.title, onScreen.body, onScreen.image);
    //     this.response.speak(say).listen(say);
    //     this.emit(':responseReady');
    // },

    'AttractionIntent': function () {
        var distance = 200;
        if (this.event.request.intent.slots.distance.value) {
            distance = this.event.request.intent.slots.distance.value;
        }

        var attraction = randomArrayElement(getAttractionsByDistance(distance));

        var say = 'Try '
            + attraction.name + ', which is '
            + (attraction.distance == "0" ? 'right downtown. ' : attraction.distance + ' miles away. Have fun! ')
            + attraction.description;

        this.response.speak(say);
        this.emit(':responseReady');
    },

    // 'AboutIntent': function () {
    //     this.response.speak(this.t('ABOUT'));
    //     this.emit(':responseReady');
    // },

    'CoffeeIntent': function () {
        var restaurant = randomArrayElement(getRestaurantsByMeal('coffee'));
        this.attributes['restaurant'] = restaurant.name;

        var say = 'For a great coffee shop, I recommend, ' + restaurant.name + '. Would you like to hear more?';
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },

    'GoOutIntent': function () {

        getWeather( ( localTime, currentTemp, currentCondition) => {
            // time format 10:34 PM
            // currentTemp 72
            // currentCondition, e.g.  Sunny, Breezy, Thunderstorms, Showers, Rain, Partly Cloudy, Mostly Cloudy, Mostly Sunny

            // sample API URL for Irvine, CA
            // https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22irvine%2C%20ca%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

            var say = 'It is ' + localTime
                + ' and the weather in ' + data.city
                + ' is '
                + currentTemp + ' and ' + currentCondition;
            this.response.speak(say);
            this.emit(':responseReady');

            // TODO
            // Decide, based on current time and weather conditions,
            // whether to go out to a local beach or park;
            // or recommend a movie theatre; or recommend staying home


        });
    },

    'AMAZON.NoIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(this.t('HELP')).listen(this.t('HELP'));
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    }

};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================


function generateScreen() {

    var titleList = ["HOME 1: Valspar A", "HOME 2: Valspar A", "HOME 3: Valspar B", "HOME 4: Valspar B", "HOME 5: Valspar C", "HOME 6: Valspar C", "HOME 7: Valspar D", "HOME 8: Valspar D"]
    var cardTitle = titleList[homeImgNumber];
    var cardBody = "";
    homeImgNumber++;
    var imageObj = {
        smallImageUrl: "https://s3.amazonaws.com/deutscherlookup/home"+ homeImgNumber +".jpg",
        largeImageUrl: "https://s3.amazonaws.com/deutscherlookup/home"+ homeImgNumber +".jpg"
    };
    // SMALL = 720w x 480h, LARGE = 1200w x 800h
    return {
        "title": cardTitle,
        "body": cardBody,
        "image": imageObj
    };
}


function generateScreen_homeOne() {
    var cardTitle = "HOME 1: Valspar - A";
    var cardBody = "You selected this.";
    var imageObj = {
        smallImageUrl: "https://s3.amazonaws.com/deutscherlookup/home1.jpg",
        largeImageUrl: "https://s3.amazonaws.com/deutscherlookup/home1.jpg"
    };
    // SMALL = 720w x 480h, LARGE = 1200w x 800h
    return {
        "title": cardTitle,
        "body": cardBody,
        "image": imageObj
    };
}

function getRestaurantsByMeal(mealtype) {

    var list = [];
    for (var i = 0; i < data.restaurants.length; i++) {

        if(data.restaurants[i].meals.search(mealtype) >  -1) {
            list.push(data.restaurants[i]);
        }
    }
    return list;
}

function getRestaurantByName(restaurantName) {

    var restaurant = {};
    for (var i = 0; i < data.restaurants.length; i++) {

        if(data.restaurants[i].name == restaurantName) {
            restaurant = data.restaurants[i];
        }
    }
    return restaurant;
}

function getAttractionsByDistance(maxDistance) {

    var list = [];

    for (var i = 0; i < data.attractions.length; i++) {

        if(parseInt(data.attractions[i].distance) <= maxDistance) {
            list.push(data.attractions[i]);
        }
    }
    return list;
}

function getWeather(callback) {
    var https = require('https');


    var req = https.request(myAPI, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            var channelObj = JSON.parse(returnData).query.results.channel;

            var localTime = channelObj.lastBuildDate.toString();
            localTime = localTime.substring(17, 25).trim();

            var currentTemp = channelObj.item.condition.temp;

            var currentCondition = channelObj.item.condition.text;

            callback(localTime, currentTemp, currentCondition);

        });

    });
    req.end();
}
function randomArrayElement(array) {
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}



//==============================================================================
//=========================== Helper Functions  ================================
//==============================================================================

function supportsDisplay() {
    var hasDisplay =
      this.event.context &&
      this.event.context.System &&
      this.event.context.System.device &&
      this.event.context.System.device.supportedInterfaces &&
      this.event.context.System.device.supportedInterfaces.Display
  
    return hasDisplay;
  }
  function isSimulator() {
    var isSimulator = !this.event.context; //simulator doesn't send context
    return isSimulator;
  }
function renderTemplate (content) {
    
      //create a template for each screen you want to display.
      //This example has one that I called "homeImages".
      //define your templates using one of several built in Display Templates
      //https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#display-template-reference
    
    
       switch(content.templateToken) {
           case "homeImages":
              // for reference, here's an example of the content object you'd
              // pass in for this template.
              //  var content = {
              //     "hasDisplaySpeechOutput" : "display "+speechOutput,
              //     "hasDisplayRepromptText" : randomFact,
              //     "simpleCardTitle" : this.t('SKILL_NAME'),
              //     "simpleCardContent" : randomFact,
              //     "bodyTemplateTitle" : this.t('GET_FACT_MESSAGE'),
              //     "bodyTemplateContent" : randomFact,
              //     "templateToken" : "homeImages",
              //     "sessionAttributes": {}
              //  };
    
               var response = {
                 "version": "1.0",
                 "response": {
                   "directives": [
                     {
                       "type": "Display.RenderTemplate",
                       "template": {
                         "type": "ListTemplate2",
                         "title": content.screenTitle,
                         "token": content.templateToken,
                         "listItems": [
                            {
                              "token": "home1",
                              "image": {
                                    "contentDescription": "home1",
                                    "sources": [
                                      {
                                        "url": "https://s3.amazonaws.com/deutscherlookup/home1.jpg"
                                      }
                                    ]
                                  },
                                  "textContent": {
                                    "primaryText": {
                                      "type": "RichText",
                                      "text": "<action token='home1Selected'>HOME: Valspar A</action>"
                                    },
                                    "secondaryText": {
                                      "text": "",
                                      "type": "PlainText"
                                    },
                                    "tertiaryText": {
                                      "text": "",
                                      "type": "PlainText"
                                    }
                                  }
                            },
                            
                            {
                                "token": "home2",
                                "image": {
                                      "contentDescription": "home2",
                                      "sources": [
                                        {
                                          "url": "https://s3.amazonaws.com/deutscherlookup/home2.jpg"
                                        }
                                      ]
                                    },
                                    "textContent": {
                                      "primaryText": {
                                        "type": "RichText",
                                        "text": "<action token='home2Selected'>HOME: Valspar A</action>"
                                      },
                                      "secondaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      },
                                      "tertiaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      }
                                    }
                            },

                            {
                                "token": "home3",
                                "image": {
                                      "contentDescription": "home3",
                                      "sources": [
                                        {
                                          "url": "https://s3.amazonaws.com/deutscherlookup/home3.jpg"
                                        }
                                      ]
                                    },
                                    "textContent": {
                                      "primaryText": {
                                        "type": "RichText",
                                        "text": "<action token='home3Selected'>HOME: Valspar B</action>"
                                      },
                                      "secondaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      },
                                      "tertiaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      }
                                    }
                            },

                            {
                                "token": "home4",
                                "image": {
                                      "contentDescription": "home4",
                                      "sources": [
                                        {
                                          "url": "https://s3.amazonaws.com/deutscherlookup/home4.jpg"
                                        }
                                      ]
                                    },
                                    "textContent": {
                                      "primaryText": {
                                        "type": "RichText",
                                        "text": "<action token='home4Selected'>HOME: HGTV B</action>"
                                      },
                                      "secondaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      },
                                      "tertiaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      }
                                    }
                            },

                            {
                                "token": "home5",
                                "image": {
                                      "contentDescription": "home5",
                                      "sources": [
                                        {
                                          "url": "https://s3.amazonaws.com/deutscherlookup/home5.jpg"
                                        }
                                      ]
                                    },
                                    "textContent": {
                                      "primaryText": {
                                        "type": "RichText",
                                        "text": "<action token='home5Selected'>HOME: Valspar C</action>"
                                      },
                                      "secondaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      },
                                      "tertiaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      }
                                    }
                            },

                            {
                                "token": "home6",
                                "image": {
                                      "contentDescription": "home6",
                                      "sources": [
                                        {
                                          "url": "https://s3.amazonaws.com/deutscherlookup/home6.jpg"
                                        }
                                      ]
                                    },
                                    "textContent": {
                                      "primaryText": {
                                        "type": "RichText",
                                        "text": "<action token='home6Selected'>HOME: HGTV C</action>"
                                      },
                                      "secondaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      },
                                      "tertiaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      }
                                    }
                            },

                            {
                                "token": "home7",
                                "image": {
                                      "contentDescription": "home7",
                                      "sources": [
                                        {
                                          "url": "https://s3.amazonaws.com/deutscherlookup/home7.jpg"
                                        }
                                      ]
                                    },
                                    "textContent": {
                                      "primaryText": {
                                        "type": "RichText",
                                        "text": "<action token='home7Selected'>HOME: Valspar D</action>"
                                      },
                                      "secondaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      },
                                      "tertiaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      }
                                    }
                            },

                            {
                                "token": "home8",
                                "image": {
                                      "contentDescription": "home8",
                                      "sources": [
                                        {
                                          "url": "https://s3.amazonaws.com/deutscherlookup/home8.jpg"
                                        }
                                      ]
                                    },
                                    "textContent": {
                                      "primaryText": {
                                        "type": "RichText",
                                        "text": "<action token='home8Selected'>HOME: HGTV D</action>"
                                      },
                                      "secondaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      },
                                      "tertiaryText": {
                                        "text": "",
                                        "type": "PlainText"
                                      }
                                    }
                            },
                          ],

                         "backgroundImage": {
                            "contentDescription": "Textured grey background",
                            "sources": [
                              {
                                "url": "https://s3.amazonaws.com/deutscherlookup/gray_bg.jpg"
                              }
                            ],
                          },
                         "textContent": {
                           "primaryText": {
                             "type": "RichText",
                             "text": ""
                           },
                           "secondaryText": {
                             "text": "",
                             "type": "PlainText"
                           },
                           "tertiaryText": {
                             "text": "",
                             "type": "PlainText"
                           }
                         },
                         "backButton": "HIDDEN"
                       }
                     }
                   ],
                   "outputSpeech": {
                     "type": "SSML",
                     "ssml": "<speak>"+content.hasDisplaySpeechOutput+"</speak>"
                   },
                   "reprompt": {
                     "outputSpeech": {
                       "type": "SSML",
                       "ssml": "<speak>"+content.hasDisplayRepromptText+"</speak>"
                     }
                   },
                   "shouldEndSession": content.askOrTell==":tell",
                   "card": {
                     "type": "Simple",
                     "title": content.simpleCardTitle,
                     "content": ""
                   }
                 },
                 "sessionAttributes": content.sessionAttributes
               }
               this.context.succeed(response);
               break;
    
           default:
              this.response.speak("Thanks for chatting, goodbye");
              this.emit(':responseReady');
       }
    
}


