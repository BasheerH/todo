$(".row").on("click",".card",function (e){
    $(this).parent().fadeOut(1000,function(){
        $(this).remove();
    })  
    e.stopPropagation()
})

// insert a new card list 
$("#butt-new-list").on("click",function (e){
    $("#new-list").append(' <div class="col-md-6 col-lg-4  my-4"> <div class="card" style="width: 18rem;"> <img  class="card-img-top" alt="..."src="note_2.png"><div class="card-body"><h5 class="card-title text-center">Date goes here</h5><p class="card-text text-center">Note title goes here</p></div></div></div>')
    
    e.stopPropagation()
})
