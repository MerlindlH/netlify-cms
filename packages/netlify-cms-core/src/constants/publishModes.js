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

const fallbackStatus = (() => OrderedMap({
  'draft': Map({label:'Drafts', textColor:'purple', backgroundColor:'purpleLight', description:'Draft'}),
  'pending_review': Map({label:'In Review', textColor:'brown', backgroundColor:'yellow', description:'Waiting for Review'}),
  'pending_publish': Map({label:'Ready', textColor:'green', backgroundColor:'greenLight', description:'Waiting to go live'}),
}))();

const statusCollection = (() => {
  //later on data gathered from config.yml / store object
  //console.log(store.getState().config.get(EDITORIAL_WORKFLOW).toJSON()); // comment to see how it works normally
  let states = [{ label: "Draft",  name: "draft", color: 'purple', order: 1 },
    { label: "In Review",  name: "pending_review", color: 'blue', order: 1 },
    { label: "Copy Edit",  name: "copyedit", color: 'teal', order: 1 },
    { label: "Blocked",  name: "blocked", color: 'red',  order: 1 },
    { label: "Ready",  name: "pending_publish", color: 'green',  order: 1 }];

  return OrderedMap(states.reduce((accu, elem) => {
    accu[elem.name] = Map({label: `${elem.label}`,
      textColor: `${elem.color}`, backgroundColor: `${elem.color}`+'Light', description: `To be finished`});
    return accu;
  },{}));
})();

export const status = (() => {
  let states = statusCollection;
  if(states === undefined) {
    states = fallbackStatus;
  }
  return states;

  // alternative to rich state objects:
  // just state mapping here and in a second data structure more information (e.g. colors / texts)
  statusObject = OrderedMap({
    DRAFT: 'draft',
    PENDING_REVIEW: 'pending_review',
    PENDING_APPLY_FEEDBACK: 'pending_apply_feedback',
    BLOCKED: 'blocked',
    PENDING_PUBLISH: 'pending_publish',
  });
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
