import { Map, OrderedMap } from 'immutable';
console.log("beforeImport");
import store from '../redux';
console.log("afterImport");

// Create/edit workflow modes
export const SIMPLE = 'simple';
export const EDITORIAL_WORKFLOW = 'editorial_workflow';

let statusObject = undefined;

// Available status
export const statusOld = OrderedMap({
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PENDING_PUBLISH: 'pending_publish',
});

export const status = (() => {

  if(statusObject === undefined) {
    console.log("Setting up status");
    //store is undefined here because it apparently doesn't get imported...?
    console.log(store.getState().config.get(EDITORIAL_WORKFLOW).toJSON()); // comment to see how it works normally
    statusObject = statusOld; // would be the data gathered from the store object above later on
  }
  return statusObject;
})();

export const statusDescriptions = Map({
  [status.get('DRAFT')]: 'Draft',
  [status.get('PENDING_REVIEW')]: 'Waiting for Review',
  [status.get('PENDING_PUBLISH')]: 'Waiting to go live',
});
