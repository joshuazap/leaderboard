PlayersList = new Mongo.Collection('players');

if(Meteor.isClient){
  Template.leaderboard.helpers({
    'player': function(){
      var currentUserId = Meteor.userId();
      return PlayersList.find({ createdBy: currentUserId }, { sort: { score: -1, name: 1 } });
    },
    'selectedClass': function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if (playerId == selectedPlayer) {
        return "selected";
      }
    },
    'selectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne({ _id: selectedPlayer });
    }
  });
  Template.leaderboard.events({
    'click .player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.remove({ _id: selectedPlayer });
    },
    'focus .focusTest': function(){
      console.log("Result of the focus test");
    },
    'blur .blurTest': function(){
      console.log("Result of the blurtest");
    },
    'mouseover .mouseoverTest': function(){
      console.log("Result of the mouseovertest");
    },
    'change .changeTest': function(){
      console.log("Result of the changetest");
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update({ _id: selectedPlayer }, { $inc: { score: 1 } });
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update({ _id: selectedPlayer }, { $inc: { score: -1 } });
    }
  });
  Template.addPlayerForm.events({
    'submit form': function(e){
      event.preventDefault();
      var playerNameVar = e.target.playerName.value;
      var playerScoreVar = e.target.playerScore.value;
      Meteor.call('createPlayer', playerNameVar, playerScoreVar);
      e.target.playerName.value = "";
      e.target.playerScore.value = "";
    }
  });

  Meteor.subscribe('thePlayers');
}

if(Meteor.isServer){
  console.log("Hello Server");
  Meteor.publish('thePlayers', function() {
    var currentUserId = this.userId;
    return PlayersList.find({ createdBy: currentUserId });
  });
}

Meteor.methods({
  'createPlayer': function(playerNameVar, playerScoreVar){
    // console.log("Hello methods");
    var currentUserId = Meteor.userId();
    PlayersList.insert({
      name: playerNameVar,
      score: playerScoreVar,
      createdBy: currentUserId
    });
  }
});
