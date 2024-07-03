export default class ErrorApi extends Error {

  constructor(message, causeObj){
    super(message, causeObj);
    this.name = 'ErrorApi';
    this.status = causeObj.status || 500;
  }
}
