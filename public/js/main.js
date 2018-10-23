// Handle Scrape Button
$('#scrapeArticles').on('click', function(action) {
  $.ajax({
    method: 'GET',
    url: '/scrapte'
  }).done(function(data) {
    console.log(data);
    window.location = '/';
  });
});

// Handle Save Button
$('.save').on('click', function() {
  var thisId = $(this).attr('data-id');
  $.ajax({
    method: 'POST',
    url: '/articles/save/' + thisId
  }).done(function(data) {
    window.location = '/';
  });
});

// Handle Delete Article button
$('.delete').on('click', function() {
  var thisId = $(this).attr('data-id');
  $.ajax({
    method: 'POST',
    url: '/articles/delete/' + thisId
  }).done(function(data) {
    window.location = '/saved';
  });
});

// Handle Save Note button
$('.saveNote').on('click', function() {
  var thisId = $(this).attr('data-id');
  if (!$('#noteText' + thisId).val()) {
    alert('Please enter a note to save');
  } else {
    $.ajax({
      method: 'POST',
      url: '/notes/save/' + thisId,
      data: {
        text: $('#noteText' + thisId).val()
      }
    }).done(function(data) {
      //Log the response
      console.log(data);
      // Empty the notes section
      $('#noteText' + thisId).val('');
      $('.modalNote').modal('hide');
      window.location = '/saved';
    });
  }
});

//Handle Delete Note button
$('.deleteNote').on('click', function() {
  var noteId = $(this).attr('data-note-id');
  var articleId = $(this).attr('data-article-id');
  $.ajax({
    method: 'DELETE',
    url: '/notes/delete/' + noteId + '/' + articleId
  }).done(function(data) {
    console.log(data);
    $('.modalNote').modal('hide');
    window.location = '/saved';
  });
});
