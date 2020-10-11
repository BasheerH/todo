// check off specific todos by clicking
// $("ul.note").on("click","li.a",function (){
//     $(this).toggleClass("grey")

// })

// Click on X to delete a todo
// $("ul.note").on("click","span",function (e){
//     $(this).parent().fadeOut(1000,function(){
//         $(this).remove();
//     })
//     e.stopPropagation()
// })

// // // register the keypress and if it blank reject it(can accept a space)
// $("input[type='text']").keypress(function(e){
//     if(e.which===13){
//         if($(this).val()!==""){
//             let todo=$(this).val();
//             $(this).val("");
//             $("ul.note").append('<form><li class="a"><span class="x"><i class="far fa-times fa-lg"></i> </span>'+ todo +"</li></form>")                            
//         }
//     }
// })