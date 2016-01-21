$(function(){
  var doc = $.parseJSON($('#embeddedData').val());
  $('body').data('doc',doc); // This saves the doc object
  $('#bcf').text(doc.bcf);   // bcf is "balance carried forward"

   var tr = $('<tr/>'); // variable for tr
   tr.append($('<td/>',{text:doc.spf}));
   tr.append($('<td/>',{text:'Balance carried forward'}));
   tr.append($('<td/>',{text:'','class':'num'}));
   tr.append($('<td/>',{text:'','class':'num'}));
   tr.append($('<td/>',{text:doc.bcf,'class':'num'}));

   $('#transactions').append(tr);
   MainTable(); // exec MainTable
   $('#show').click(function(){ // show or hide
   fillTable($('#search').val().toUpperCase(),'results')
  });
    $('#transactions td').click(function(){ // function click
    $(this).parent('tr').toggleClass('picked');
    var term = $(this).parent('tr').data('trn').nar;
    $('#search').val(term); // search bar
    $('#show').trigger('click'); // show
    var total = 0;var count = 0; // variable total (summ) and count
$('#transactions tr.picked').each(function(i,tr){
  total += $(tr).data('trn').amt;count++;
});
var totalDiv = $('<div/>',{ // totalDiv = div
	  text:cnt+' items selected total: '+total+'€',
	  css:{width:'13em',position:'fixed',left:'50ex',top:'10ex', // css
	       padding:'2em',backgroundColor:'yellow',border:'solid thin black', //css
		   borderRadius:'1em' //css
	      },
	  id:'totalDiv'
	});
	$('#totalDiv').remove();
	if ($('.picked').length>0)
	  $('body').prepend(totalDiv);
  });
  spend(); // exec spend
});
  function MainTable(){ // function MainTable
  var doc = $('body').data('doc'); // doc = data doc in body
  var balance = doc.bcf;
  for(var i=0;i<doc.trn.length;i++){
    var tr = $('<tr/>',{'class':'generated'});
    tr.append($('<td/>',{text:doc.trn[i].whn}));
    tr.append($('<td/>',{text:doc.trn[i].nar}));
    var amt = doc.trn[i].amt;
    balance += amt;
    tr.append($('<td/>',{text:amt<0?-amt:'','class':'num'}));
    tr.append($('<td/>',{text:amt<0?'':amt,'class':'num'}));
    tr.append($('<td/>',{text:balance,'class':'num'}));
    tr.data('trn',doc.trn[i]);
    tr.appendTo($('#transactions'));
  }
}
function spend(){ // function spend
  var c = {};
  var trn = $('body').data('doc').trn;
  for(var i=0;i<trn.length;i++){
    var words = trn[i].nar.split(' - ');
    if (typeof c[words[0]] === "undefined")
      cats[words[0]] = 0;
    cats[words[0]] += trn[i].amt;
  }
  for(var k in c){
    $('#c').append($('<tr/>')
      .append($('<td/>',{text:k}))
      .append($('<td/>',{text:c[k],'class':'num'})));
  }
}
function fillTable(term,dest){
  if (typeof dest === 'undefined') dest = 'all';
  var doc = $('body').data('doc');
  $('#results tr.generated').remove();
  for(var i=0;i<doc.trn.length;i++){
    if (typeof term === 'undefined' ||
        doc.trn[i].nar.indexOf(term)>-1){
      var tr = $('<tr/>',{'class':'generated'});
      tr.append($('<td/>',{text:doc.trn[i].whn}));
      tr.append($('<td/>',{text:doc.trn[i].nar}));
      tr.append($('<td/>',{text:doc.trn[i].amt}));
      tr.data('trn',doc.trn[i]);
      tr.appendTo($('#'+dest));
    }
  }
}
