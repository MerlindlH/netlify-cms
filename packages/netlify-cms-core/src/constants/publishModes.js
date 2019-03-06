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
    //console.log(store.getState().config.get(EDITORIAL_WORKFLOW).toJSON()); // comment to see how it works normally
    statusObject = OrderedMap({
      DRAFT: 'draft',
      PENDING_REVIEW: 'pending_review',
      PENDING_APPLY_FEEDBACK: 'pending_apply_feedback',
      PENDING_APPLY_FEEDBACK2: 'pending_apply_feedback2',
      PENDING_APPLY_FEEDBACK3: 'pending_apply_feedback3',
      PENDING_APPLY_FEEDBACK4: 'pending_apply_feedback4',
      PENDING_APPLY_FEEDBACK5: 'pending_apply_feedback5',
      PENDING_PUBLISH: 'pending_publish',
    }); // would be the data gathered from the store object above later on
  }
  return statusObject;
})();

const statusCollection = (() => {
  let states = [{label: "Draft",  name: "draft", color: 'purple', order: 1}];


  states.map((elem) => {
    return {[elem.name] : {label: `${elem.label}`,
        textColor: `${elem.color}`, backgroundColor: `${elem.color}`+'Light', description: `To be finished`}};
  });
  return Map({
    ...states
  });
  // return {
  //   'draft': {
  //     title: 'Draft',
  //     textColor: 'purple',
  //     backgroundColor: 'purpleLight',
  //     description: 'Draft'
  //   }
  // }
})();

export const statusColors = (()=>{
  let states = [{label: "Draft",  name: "draft", color: 'purple', order: 1}];
  states.map((elem) => {
    return {[elem.name] : {text: `${elem.color}`, background: `${elem.color}`+'Light'}};
  });
  return Map({
    ...states
  })
})();

export const statusDescriptions = Map({
  [status.get('DRAFT')]: 'Draft',
  [status.get('PENDING_REVIEW')]: 'Waiting for Review',
  [status.get('PENDING_PUBLISH')]: 'Waiting to go live',
});
