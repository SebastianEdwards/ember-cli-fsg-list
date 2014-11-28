import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

// list data used for testing;
var list = [
  {id: 1 , name: 'Chun Yang'       , occupation: 'Web Developer'} ,
  {id: 2 , name: 'Dummy A'         , occupation: 'Web Developer'} ,
  {id: 3 , name: 'Dummy B'         , occupation: 'QA'}            ,
  {id: 4 , name: 'Ellen Degeneres' , occupation: 'QA'}            ,
  {id: 5 , name: 'Jackie Chan'     , occupation: 'Manager'}       ,
].map(function(obj){
  return Ember.Object.create(obj);
});
list = Ember.A(list);

moduleForComponent('fsg-list', 'FsgListComponent', {
  // specify the other units that are required for this test
  needs: ['template:person'],
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});

test('it shows a list of partials', function(){
  expect(5);

  var component = this.subject();
  component.set('list', list);
  component.set('itemPartial', 'person');
  this.append();

  Ember.run(function(){
    var items = $('.item');
    list.forEach(function(item, index){
      var name = items.eq(index).find('.name').text();
      equal(name, item.get('name'));
    });
  });
});

test('it should show new item when we add one', function(){
  expect(2);

  var listCopy = Ember.copy(list);

  var component = this.subject();
  component.set('list', listCopy);
  component.set('itemPartial', 'person');
  this.append();

  Ember.run(function(){
    equal($('.item').length, 5);
  });

  Ember.run(function(){
    listCopy.pushObject(Ember.Object.create({
      id: 100, name: 'Mike Chun', occupation: 'Web Designer'
    }));
  });

  Ember.run(function(){
    equal($('.item').length, 6);
  });
});

test('it should filter the list by filterTerm and filter(filterKeys)', function(){
  expect(5);

  var component = this.subject();
  component.set('list', list);
  component.set('itemPartial', 'person');
  component.set('filterTerm', 'Chun');
  component.set('filter', ['name']);
  this.append();

  Ember.run(function(){
    var items = $('.item');
    list.forEach(function(item){
      var selector = '.name:contains("' + item.get('name') + '")';
      var exist = !!items.find(selector).length;
      if(item.get('name') === 'Chun Yang'){
        equal(exist, true);
      } else {
        equal(exist, false);
      }
    });
  });
});

test('it should filter the list by filterTerm and filter(filterFn)', function(){
  expect(5);

  var component = this.subject();
  component.set('list', list);
  component.set('itemPartial', 'person');
  component.set('filterTerm', 'Chun');
  component.set('filter', function(item){
    return item.get('id') > 3;
  });
  this.append();

  Ember.run(function(){
    var items = $('.item');
    list.forEach(function(item){
      var selector = '.id:contains("' + item.get('id') + '")';
      var exist = !!items.find(selector).length;
      if(item.get('id') > 3){
        equal(exist, true);
      } else {
        equal(exist, false);
      }
    });
  });
});

test('it can be sorted by sortOrders', function(){
  expect(1);

  var component = this.subject();
  component.set('list', list);
  component.set('itemPartial', 'person');
  component.set('sortOrders', ['occupation:desc', 'name:desc']);
  this.append();

  var sequence = $('.item .id').text();
  deepEqual(sequence, '21435');
});
