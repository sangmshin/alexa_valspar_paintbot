const Alexa = require('alexa-sdk');
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeImage = Alexa.utils.ImageUtils.makeImage;
const ImageUtils = require('alexa-sdk').utils.ImageUtils;
const TextUtils = require('alexa-sdk').utils.TextUtils;


var APP_ID = "amzn1.ask.skill.2fbde362-6726-4f85-8497-9864787e91c6"; // TODO replace with your app ID (OPTIONAL).


// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

const languageStrings = {
  'en': {
    'translation': {
      'WELCOME': "Welcome to Paintbot.",
      'HELP': "Welcome to Paintbot. Picking a paint depends on the painter. So, let’s start with a few questions. When you’re about to start a project, do you jump right in, or would you rather hide under the bed?",
      'STOP': "I am sorry to hear you are leaving. See you next time!"
    }
  }
};
const data = {
  "city": "New York",
  "state": "NY",
  "postcode": "10001",
  "restaurants": [{
      "name": "Zeke's Place",
      "address": "66 East Main Street",
      "phone": "978-283-0474",
      "meals": "breakfast, lunch",
      "description": "A cozy and popular spot for breakfast.  Try the blueberry french toast!"
    },
    {
      "name": "Morning Glory Coffee Shop",
      "address": "25 Western Avenue",
      "phone": "978-281-1851",
      "meals": "coffee, breakfast, lunch",
      "description": "A homestyle diner located just across the street from the harbor sea wall."
    },
    {
      "name": "Sugar Magnolias",
      "address": "112 Main Street",
      "phone": "978-281-5310",
      "meals": "breakfast, lunch",
      "description": "A quaint eatery, popular for weekend brunch.  Try the carrot cake pancakes."
    },
    {
      "name": "Seaport Grille",
      "address": "6 Rowe Square",
      "phone": "978-282-9799",
      "meals": "lunch, dinner",
      "description": "Serving seafood, steak and casual fare.  Enjoy harbor views on the deck."
    },
    {
      "name": "Latitude 43",
      "address": "25 Rogers Street",
      "phone": "978-281-0223",
      "meals": "lunch, dinner",
      "description": "Features artsy decor and sushi specials.  Live music evenings at the adjoining Minglewood Tavern."
    },
    {
      "name": "George's Coffee Shop",
      "address": "178 Washington Street",
      "phone": "978-281-1910",
      "meals": "coffee, breakfast, lunch",
      "description": "A highly rated local diner with generously sized plates."
    },

  ],
  "attractions": [{
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

var states = {
  // STARTMODE: '_STARTMODE', // Prompt the user to start or restart the game.
  ASKMODE: '_ASKMODE' // Alexa is asking user the questions.
  // DESCRIPTIONMODE: '_DESCRIPTIONMODE' // Alexa is describing the final choice and prompting to start again or quit
};

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context, callback);

  alexa.APP_ID = APP_ID;
  ///alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes
  alexa.resources = languageStrings;
  alexa.registerHandlers(newSessionHandler, askQuestionHandlers);
  alexa.execute();
};

var yesIntent_usage = 0;

var newSessionHandler = {
  'LaunchRequest': function () {

    this.handler.state = states.ASKMODE;
    yesIntent_usage = 0;

    const builder = new Alexa.templateBuilders.BodyTemplate1Builder();

    let template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/welcome_bg.jpg')).setBackButtonBehavior("HIDDEN").build();

    var say = "Okay, what are you painting?";
    this.response.speak(say).listen(say).renderTemplate(template);
    this.emit(':responseReady');

  },
  // 'NewSession': function () {
  //   this.handler.state = states.ASKMODE;
  //   this.emit('Kitchen_Intent' + states.ASKMODE);
  // },
  'AMAZON.HelpIntent': function () {
    this.handler.state = states.ASKMODE;
    var say = "Welcome to Paintbot. what are you painting?";
    this.response.speak(say).listen(say);
    this.emit(':responseReady');
  },
  'Unhandled': function () {
    this.handler.state = states.ASKMODE;
    var say = "I am sorry. I did not quite get that. Can you try again please? Waht are you painting?";
    var resay = "What are you painting?";
    this.response.speak(say).listen(resay);
    this.emit(':responseReady');
    
  },

};

var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

  'Kitchen_Intent': function () {
    this.handler.state = states.ASKMODE;

    const builder = new Alexa.templateBuilders.BodyTemplate3Builder();

    let template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/welcome_bg.jpg')).setBackButtonBehavior("HIDDEN").build();

    var say = 'Let’s find the right paint. Choosing a paint depends on the painter. Okay, when you’re starting a project, do you jump right in, or would you rather hide under the bed?';

    this.response.speak(say).listen(say).renderTemplate(template);

    this.emit(':responseReady');
  },

  'JumpRightIn_Intent': function () {
    this.handler.state = states.ASKMODE;

    const builder = new Alexa.templateBuilders.BodyTemplate3Builder();

    let template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/welcome_bg.jpg')).setBackButtonBehavior("HIDDEN").build();

    var say = 'Okay, do you know what you want your room to look like?';

    this.response.speak(say).listen(say).renderTemplate(template);

    this.emit(':responseReady');
  },

  'AMAZON.YesIntent': function () {
    this.handler.state = states.ASKMODE;

    const builder = new Alexa.templateBuilders.BodyTemplate1Builder();

    let template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/unique_calm.jpg')).setBackButtonBehavior("HIDDEN").build();

    var say = '<prosody volume="x-loud">Got it.</prosody> And do you want your home to feel unique? Or coordinated.';

    if (yesIntent_usage == 0) {

      this.response.speak(say).listen(say).renderTemplate(template);


    } else if (yesIntent_usage == 1) {

      var content = {
        "hasDisplaySpeechOutput": "Here you go. Pick one.",
        "hasDisplayRepromptText": "Here you go. Pick one.",
        "screenTitle": "HGTV + Valspar Paintbot",
        "simpleCardTitle": 'HGTV + Valspar',
        "templateToken": "colorImages",
        "askOrTell": ":ask",
        "sessionAttributes": {
          "STATE": "_ASKMODE"
        }
      };

      renderTemplate.call(this, content);

    } else if (yesIntent_usage == 2) {

      say = '<prosody volume="x-loud">Great.</prosody> You can find it at Lowes. Here’s the closest one. I just texted you the address. Would you like a coupon too?';
      template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/lowes.jpg')).setBackButtonBehavior("HIDDEN").build();

      yesIntent_usage = 3;
      this.response.speak(say).listen(say).renderTemplate(template);

    } else if (yesIntent_usage == 3) {

      say = '<prosody volume="x-loud">Oh,</prosody> one last thing. You’ll find Valspar in aisle five. Now go out there and get painting.';
      template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/coupon.jpg')).setBackButtonBehavior("HIDDEN").build();

      yesIntent_usage = 0;
      this.response.speak(say).renderTemplate(template);

    }

    this.emit(':responseReady');

  },

  'Unique_Intent': function () {
    this.handler.state = states.ASKMODE;

    var content = {
      "hasDisplaySpeechOutput": "Good choice. Last question. which one makes you smile?",
      "hasDisplayRepromptText": "which one makes you smile?",
      "screenTitle": "HGTV + Valspar Paintbot",
      "simpleCardTitle": 'HGTV + Valspar',
      "templateToken": "homeImages",
      "askOrTell": ":ask",
      "sessionAttributes": {
        "STATE": "_ASKMODE"
      }
    };

    renderTemplate.call(this, content);

  },


  'HomeOne_Intent': function () {
    this.handler.state = states.ASKMODE;

    const builder = new Alexa.templateBuilders.BodyTemplate1Builder();

    let template = builder.setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/3cans.jpg')).setBackButtonBehavior("HIDDEN").build();

    var say = '<emphasis level="strong">Nice!</emphasis> It looks like you’re a Rebel with a Roller. You don’t follow trends, you make your own. - Valspar seems right for you. Would you like to see some color palettes from Valspar?';

    yesIntent_usage = 1;

    this.response.speak(say).listen(say).renderTemplate(template);
    this.emit(':responseReady');
  },

  'Strawberry_Intent': function () {
    this.handler.state = states.ASKMODE;

    const builder = new Alexa.templateBuilders.BodyTemplate1Builder();

    let template = builder.setTitle('Whipped Strawberry').setBackgroundImage(makeImage('https://s3.amazonaws.com/deutscherlookup/strawberry.jpg')).setTextContent(makePlainText('Would you like to buy this?')).setBackButtonBehavior("HIDDEN").build();

    var say = '<emphasis level="strong">Whipped Strawberry.</emphasis> Whipped Strawberry. Sounds delicious. Would you like to buy this?';

    yesIntent_usage = 2;

    this.response.speak(say).listen(say).renderTemplate(template);
    this.emit(':responseReady');
  },

  'ElementSelected': function () {
    this.handler.state = states.ASKMODE;

    const token = this.event.request.token; // the token of 

    yesIntent_usage == 0
    ? this.emit('HomeOne_Intent')
    : yesIntent_usage == 1
    ? this.emit('Strawberry_Intent')
    : null
    
  },

  'AMAZON.NoIntent': function () {
    this.handler.state = states.ASKMODE;
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
    this.handler.state = states.ASKMODE;
    this.emit('SessionEndedRequest');
  },
  'SessionEndedRequest': function () {
    this.response.speak(this.t('STOP'));
    this.emit(':responseReady');
  },

  'Unhandled': function () {
    this.handler.state = states.ASKMODE;
    var say = "I am sorry. I did not quite get that. Can you try saying that again please?";
    this.response.speak(say).listen(say);
    this.emit(':responseReady');
  }


});

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function getRestaurantsByMeal(mealtype) {

  var list = data.restaurants.map( rest => {
    rest.meals.search(mealtype) > -1
    && rest
  }
  return list;
}

function getRestaurantByName(restaurantName) {

  var restaurant = {};
  for (var i = 0; i < data.restaurants.length; i++) {

    if (data.restaurants[i].name == restaurantName) {
      restaurant = data.restaurants[i];
    }
  }
  return restaurant;
}

function getAttractionsByDistance(maxDistance) {

  var list = data.attractions.map( attr => {
    parseInt(attr.distance) <= maxDistance
    && attr
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
  return (array[i]);
}

//==============================================================================
//=========================== Helper Functions  ================================
//==============================================================================


function renderTemplate(content) {

  switch (content.templateToken) {

    case "homeImages":

      var response = {
        "version": "1.0",
        "response": {
          "directives": [{
            "type": "Display.RenderTemplate",
            "template": {
              "type": "ListTemplate2",
              "title": content.screenTitle,
              "token": content.templateToken,
              "listItems": [{
                  "token": "home1",
                  "image": {
                    "contentDescription": "home1",
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/home1.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='home1Selected'>HOME: Valspar</action>"
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
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/home2.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='home2Selected'>HOME: HGTV</action>"
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
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/home3.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='home3Selected'>HOME: Valspar</action>"
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
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/home4.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='home4Selected'>HOME: HGTV</action>"
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
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/home5.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='home5Selected'>HOME: Valspar</action>"
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
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/home6.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='home6Selected'>HOME: HGTV</action>"
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
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/home7.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='home7Selected'>HOME: Valspar</action>"
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
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/home8.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='home7Selected'>HOME: HGTV</action>"
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
                "sources": [{
                  "url": "https://s3.amazonaws.com/deutscherlookup/gray_bg.jpg"
                }],
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
          }],
          "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak>" + content.hasDisplaySpeechOutput + "</speak>"
          },
          "reprompt": {
            "outputSpeech": {
              "type": "SSML",
              "ssml": "<speak>" + content.hasDisplayRepromptText + "</speak>"
            }
          },
          "shouldEndSession": content.askOrTell == ":tell",
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



    case "colorImages":

      var response = {
        "version": "1.0",
        "response": {
          "directives": [{
            "type": "Display.RenderTemplate",
            "template": {
              "type": "ListTemplate2",
              "title": content.screenTitle,
              "token": content.templateToken,
              "listItems": [{
                  "token": "color1",
                  "image": {
                    "contentDescription": "color1",
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/color1.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='color1Selected'>Vibrant Reds</action>"
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
                  "token": "color2",
                  "image": {
                    "contentDescription": "color2",
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/color2.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='color2Selected'>Tropical Oranges</action>"
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
                  "token": "color3",
                  "image": {
                    "contentDescription": "color3",
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/color3.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='color3Selected'>Sunny Yellows</action>"
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
                  "token": "color4",
                  "image": {
                    "contentDescription": "color4",
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/color4.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='color4Selected'>Bright Greens</action>"
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
                  "token": "color5",
                  "image": {
                    "contentDescription": "color5",
                    "sources": [{
                      "url": "https://s3.amazonaws.com/deutscherlookup/color5.jpg"
                    }]
                  },
                  "textContent": {
                    "primaryText": {
                      "type": "RichText",
                      "text": "<action token='color5Selected'>Oceanic Blues</action>"
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
                "sources": [{
                  "url": "https://s3.amazonaws.com/deutscherlookup/white_bg.jpg"
                }],
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
          }],
          "outputSpeech": {
            "type": "SSML",
            "ssml": "<speak>" + content.hasDisplaySpeechOutput + "</speak>"
          },
          "reprompt": {
            "outputSpeech": {
              "type": "SSML",
              "ssml": "<speak>" + content.hasDisplayRepromptText + "</speak>"
            }
          },
          "shouldEndSession": content.askOrTell == ":tell",
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
