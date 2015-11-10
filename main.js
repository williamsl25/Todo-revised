
var page = {
config: {
  url: "https://tiny-tiny.herokuapp.com/collections/bucketList",
},

  init:function(){
    page.initStyling();
    page.initEvents();
  },
  initStyling:function(){
    page.getItem();

  },
  initEvents:function(){

  // EDIT Bucket Item-------------
  $('section').on('click', '.listItem', function (event){
  event.preventDefault();
  $(this).closest('.listItem').replaceWith('<input type="text" class="updateListItem" placeholder="Edit Bucket List Item" name="updateListItem"</input>');
  $('.updateListItem').parent().siblings('.editItem').addClass('show');
  });

  $('.inputs').on('click', '#editedItem', function (event) {
  event.preventDefault();
  var itemId = $('.updateListItem').closest('article').data('itemid');
  var editedListItem = {
    title: $('.updateListItem').val(),
    complete: false
  }
  page.updateItem(itemId, editedListItem);

  });

  //CREATE NEW BUCKET ITEM------------
  $('.createItem').on('submit', function(event){
      event.preventDefault();
        var newItem = {
          title: $(this).find('input[name="newTitle"]').val(),
          complete: false,

        };
      page.createItem(newItem);
  });


  //DELETE BUCKET//
    $('section').on('click', '.deleteItem', function (event){
      event.preventDefault();
      var taskId = $(this).closest('article').data('itemid');
      page.deleteItem(taskId);
    });
  //strikethrough when click the check
    $('section').on('click', '.completeItem', function(event){
      event.preventDefault();
      $(this).parent().siblings('h4').toggleClass('complete')

    });

},

getItem: function() {
    $.ajax({
      url: page.config.url,
      type: 'GET',
      success: function (bucket) {

        var template = _.template(templates.bucket);
        var bucketItm = "";
        bucket.forEach(function(item, idx, arr){
          bucketItm += template(item);
        });
        console.log('bucketItm is...', bucketItm);
        $('section').html(bucketItm);

      },
      error: function (err) {
        console.log("DID NOT GET ITEM", err);
      }
    });
  },


createItem: function(newItem) {
  $.ajax({
    url: page.config.url,
    data: newItem,
    type: 'POST',
    success: function (data) {
      console.log("SUCCESSFULLY CREATED NEW BUCKET", data);
      page.getItem();
    },
    error: function (err) {
      console.log("DID NOT CREATE NEW BUCKET", err);
    }
  });
  $('input').val('');

  },
  // console.log("NEW bucket", newBucket)

  deleteItem: function(itemId) {
    $.ajax({
      url: page.config.url + "/" + itemId,
      type: 'DELETE',
      success: function (data) {
        console.log("Delete success!", data);
        page.getItem();
      },
      error: function (err) {
        console.log("delete failed",err);
      }
    });
  },
  updateItem: function(itemId, editedItem) {
    $.ajax({
      url: page.config.url + "/" + itemId,
      type: 'PUT',
      data: editedItem,
      success: function(data) {
        console.log("update success!", data);
        page.getItem();

      },

      error: function(err) {
        console.log("update Error", err);
      }
    });
  }
}

$(document).ready(function () {
   page.init();
});
