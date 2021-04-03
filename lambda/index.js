/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const axios = require('axios');

const hello='Olá, tudo bem?';
const helpSpeak = 'Você pode me pedir um Preço unitário ou me pedir para listar os destaques.'

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = `${hello} ${helpSpeak}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ConsultaDestaquesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConsultaDestaquesIntent';
    },
   async handle(handlerInput) {
       let speakOutput = "";
        try {
            const res = await axios.get("https://api.oliveiratrust.com.br/v1/titulos/destaques");
            const data=res.data;
            if(data.length===0){
                speakOutput = `${speakOutput} Nenhum destaque foi encontrado.`;
            }else if(data.length===1){
                speakOutput = `${speakOutput} O destaque encontrado foi ${data[0].descricao}.`;
            }else{
               speakOutput = `${speakOutput} Foram encontrados ${data.length} destaques. Dentre eles `;
                for (let i = 0; i < data.length; i += 1) {
                    if(i === (data.length-1)){
                        speakOutput = `${speakOutput} e `;
                    }else{
                        speakOutput = `${speakOutput} , `;
                    }
                  speakOutput = `${speakOutput} ${data[i].descricao} `;
                }
                speakOutput = `${speakOutput}.`;
            }
          } catch (err) {
            speakOutput = `${speakOutput} E não foi possível realizar a busca.`;
            console.log(`ERROR: ${JSON.stringify(err)}`);
            console.log(err);
          }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Deseja saber o preço unitário de qual ativo?')
            .getResponse();
    }
};

const ConsultaPrecoUnitarioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConsultaPrecoUnitarioIntent';
    },
   async handle(handlerInput) {
        
        const ativoDesejado=handlerInput.requestEnvelope.request.intent.slots.ativo.value;
        
        let speakOutput = `Foi feita a busca por ${ativoDesejado}. `;
        const urlConsulta = `https://api.oliveiratrust.com.br/v1/titulos/todos?indexador=TODOS&order=nome&search=${ativoDesejado}&type=todos`;
        try {
            const res = await axios.get(urlConsulta);
            const data=res.data;
            if(data.length===0){
                speakOutput = `${speakOutput} E nenhum ativo foi encontrado.`;
            }else if(data.length===1){
                speakOutput = `${speakOutput} E foi encontrado o ativo ${data[0].nomeg} com o preço unitário cotado a ${data[0].valor_pu} em ${data[0].data_pu}.`;
            }else{
               speakOutput = `${speakOutput} E foram encontrados ${data.length} ativos. Dentre eles `;
                for (let i = 0; i < data.length; i += 1) {
                    if(i === (data.length-1)){
                        speakOutput = `${speakOutput} e `;
                    }else{
                        speakOutput = `${speakOutput} , `;
                    }
                  speakOutput = `${speakOutput} ${data[i].nomeg} com o preço unitário cotado a ${data[i].valor_pu} em ${data[i].data_pu} `;
                }
                speakOutput = `${speakOutput}.`;
            }
          } catch (err) {
            speakOutput = `${speakOutput} E não foi possível realizar a busca.`;
            console.log(`ERROR: ${JSON.stringify(err)}`);
            console.log(err);
          }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Deseja saber o preço unitário de qual ativo?')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(helpSpeak)
            .reprompt(helpSpeak)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Até a próxima!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Desculpe não consegui entender. ${helpSpeak}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConsultaPrecoUnitarioIntentHandler,
        ConsultaDestaquesIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();