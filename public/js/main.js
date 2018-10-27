$(() => {
  // declare functions
  var scrapeArticles = () => {
    $.get('/scrape').then(data => {
      $('body').html(data);
    });
  };

  var saveArticle = function() {
    var id = $(this).data('id');

    $.ajax({
      url: `/article/${id}`,
      method: 'PUT'
    }).then(data => {
      location.reload();
    });
  };

  var removeArticle = function() {
    var id = $(this).data('id');

    $.ajax({
      url: `/article/remove/${id}`,
      method: 'PUT'
    }).then(data => {
      location.reload();
    });
  };

  var viewNotes = function() {
    var articleId = $(this).data('id');

    // send request to get article's notes if exist
    $.ajax({
      url: `/article/${articleId}`,
      method: 'GET'
    }).then(data => {
      // create modal with article id
      $('.modal-content').html(`
              <div class="modal-header">
                  <h5 class="modal-title">${data.title}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body">
                  <ul class="list-group"></ul>
                  <textarea name="note" class="note-content"></textarea>
              </div>
              <div class="modal-footer">
                  <button type="button" data-id="${
                    data._id
                  }" class="btn btn-primary btn-save-note">Comment</button>
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>`);
      console.log('data', data);
      var totalNotes = data.notes.length;
      console.log(totalNotes);

      // if there is no note
      if (totalNotes == 0) {
        var message = `<small class="text-muted">This article doesn't have any note yet.</small>`;
        $('.modal-body').prepend(message);
        console.log('message', message);
      }
      // if there is/are note(s)
      else {
        var notes = data.notes;
        // loop through notes and append to modal
        notes.forEach(note => {
          $('.list-group').append(`
                      <li class="list-group-item justify-content-between">
                          ${note.body}
                          <span><i class="material-icons" data-id="${
                            note._id
                          }">delete_forever</i></span>
                      </li>
                  `);
        });
      }

      $('.modal').modal('show');
    });
  };

  var saveNote = function() {
    var id = $(this).data('id');
    var content = $('.note-content')
      .val()
      .trim();

    if (content) {
      $.ajax({
        url: `/note/${id}`,
        method: 'POST',
        data: {
          body: content
        }
      }).then(data => {
        // clear textarea
        $('.note-content').val('');
        // hide modal
        $('.modal').modal('hide');
      });
    } else {
      $('.note-content').val('');
      return;
    }
  };

  var deleteNote = function() {
    var id = $(this).data('id');

    $.ajax({
      url: `/note/${id}`,
      method: 'DELETE'
    }).then(data => {
      // hide modal
      $('.modal').modal('hide');
    });
  };

  // hide scrape button if on page 'saved'
  if (window.location.href.includes('saved')) {
    $('.scrape').hide();
  }

  // keep scrollbar bottom
  var contentBox = $('.note-content');
  contentBox.scrollTop = contentBox.scrollHeight;

  // click events
  $('.scrape').on('click', scrapeArticles);
  $('.btn-save').on('click', saveArticle);
  $('.btn-remove').on('click', removeArticle);
  $('.btn-view-notes').on('click', viewNotes);
  // handle click events for elements created dynamically
  $(document).on('click', '.btn-save-note', saveNote);
  $(document).on('click', '.material-icons', deleteNote);
});
