$(function(){
  $('body').data('doc',$.parseJSON($('#embeddedData').val()));
  var doc = $('body').data('doc');
  $('#bcf').text(doc.bcf);
  $('#odl').text(doc.odl);
  $('#cname').text(doc.cname);
  $('#caddr').text(doc.caddr.street+", "+doc.caddr.pc+" "+doc.caddr.town);
  var tr = $('<tr/>');
  tr.append($('<td/>',{text:doc.spf}));
  tr.append($('<td/>',{text:'Balance carried forward'}));
  tr.append($('<td/>',{text:'','class':'num'}));
  tr.append($('<td/>',{text:'','class':'num'}));
  tr.append($('<td/>',{text:doc.bcf,'class':'num'}));
  $('#transactions').append(tr);
  fillMainTable();
  $('#show').click(function(){
    fillTable($('#search').val().toUpperCase(),'results')
  });
  $('#transactions td').click(function(){
    $(this).parent('tr').toggleClass('picked');
    var term = $(this).parent('tr').data('trn').nar;
    $('#search').val(term);
    $('#show').trigger('click');
	var tot = 0;var cnt = 0;
	$('#transactions tr.picked').each(function(i,tr){
	  tot += $(tr).data('trn').amt;cnt++;
	});
	var totDiv = $('<div/>',{
	  text:cnt+' items selected total: '+tot+'€',
	  css:{width:'13em',position:'fixed',left:'50ex',top:'10ex',
	       padding:'2em',backgroundColor:'yellow',border:'solid thin black',
		   borderRadius:'1em'
	      },
	  id:'totDiv'
	});
	$('#totDiv').remove();
	if ($('.picked').length>0)
	  $('body').prepend(totDiv);
  });
  spendCats();
});

function fillMainTable(){
  var doc = $('body').data('doc');
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

function spendCats(){
  var cats = {};
  var trn = $('body').data('doc').trn;
  for(var i=0;i<trn.length;i++){
    var wrds = trn[i].nar.split(' - ');
    if (typeof cats[wrds[0]] === "undefined")
      cats[wrds[0]] = 0;
    cats[wrds[0]] += trn[i].amt;
  }
  for(var k in cats){
    $('#cats').append($('<tr/>')
      .append($('<td/>',{text:k}))
      .append($('<td/>',{text:cats[k],'class':'num'})));
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