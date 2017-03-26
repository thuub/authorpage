sv.factory('Publication', function ($resource) {
    alert("Publication")
    var url = "//127.0.0.1/publin/rest/publication/:id";
    return $resource(url, {});
});
sv.factory('AuthorREST', function ($resource) {
    alert("AuthorREST")
    var url = "//127.0.0.1/publin/rest/author/:id";
    return $resource(url, {});
});
sv.factory('Abstract', function ($resource,ENDPOINT_ABSTRACT,ENDPOINT_ABSTRACT_OFFLINE,REST_ENTPOINT_TYPE) {
    var url ="";
    switch (REST_ENTPOINT_TYPE){
        case "OFFLINE": url = ENDPOINT_ABSTRACT_OFFLINE+":id"; break;
        case "REMOTE" : url = ENDPOINT_ABSTRACT+":id"; break;
    }
    return $resource(url, {});
});

sv.factory('Author', function ($resource,REST_ENDPOINT,REST_ENDPOINT_OFFLINE,REST_ENTPOINT_TYPE) {
    var url = "";
    switch (REST_ENTPOINT_TYPE){
        case "OFFLINE": url = REST_ENDPOINT_OFFLINE+"author/:id"; break;
        case "REMOTE" : url = REST_ENDPOINT+"author/:id"; break;
    }
    return $resource(url, {});
});