if (typeof XMLHttpRequest == "undefined") {
  XMLHttpRequest = function () {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
    catch (e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
    catch (e) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
    catch (e) {}
    //Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
    throw new Error("This browser does not support XMLHttpRequest.");
  };
}

const Resource = function(name) {
  this.name = './data/' + name + '.json';
  this.get = (func) => {
    if (location.href.startsWith && location.href.startsWith('file')) {
      console.log('yoo');
      return func({type: 'star', name: 'sun', radius: 6.9424895E8});
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4){
        var json = xmlhttp.responseText;
        var obj = eval('(' + json + ')');
        func(obj);
      }
    };
    xmlhttp.open("GET", this.name, true);
    xmlhttp.send(null);
  };
};


export default Resource;
