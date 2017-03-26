/*   REST ENDPOINTS   */
sv.constant('SEARCH_ENDPOINT', "http://127.0.0.1/publin/rest/search/");
sv.constant('REST_ENDPOINT', "http://127.0.0.1/publin/rest/");
sv.constant('REST_ENDPOINT_OFFLINE', "offlineRest/");
sv.constant('ENDPOINT_ABSTRACT', "http://127.0.0.1/publin/rest/abstract/");
sv.constant('ENDPOINT_ABSTRACT_OFFLINE', "offlineRest/abstract/");

// REMOTE / OFFLINE
sv.constant("REST_ENTPOINT_TYPE", "OFFLINE");
/*   SETTINGS PUBLICATIONS*/
sv.constant('SETTINGS_PUBLICATIONS', {
    order: {
        title: 0,
        author: 1,
        journal: 2
    },
    showCites: true
});
/*   SETTINGS ZITATIONSGRAPH*/
sv.constant('SETTINGS_FDG_CITE', {
    color: {
        author: '#555555',
        publication: '#4E9EAD',
        citation: '#7F002F',
        edgeAuthorPublication: '#4E9EAD',
        edgePublicationCitation: '#4E9EAD'
    },
    hightlightColor: {
        author: 'rgb(0,0,255)',
        publication: '#7F002F',
        citation: '#BF567D'
    },
    showSources: true,
    physicsSettings: {}
});

sv.constant('SETTINGS_INDEX_CALCULATOR', {
    title : "Index Editor",
    startTab: 1,
    editable: true,
    showHelpTab: true,
    additionalExamples: {
        "ich komme aus der app.config": '1/0'
    },
    editor: {
        initText: [
            {icon: "spider", text: '/s chart("clear")\n/s chart("title","Übersicht")\n/s chart("icon","spider")\n/s chart("polar",true)\n/s n = author.publications\n/s\n/s xaxisValues = ["Anzahl Publikationen", "⌀ Autorenanzahl", "Zitate", "Anzahl Erstautor", "Zitat pro Publikation"]\n/s chart("xaxis values",xaxisValues)\n/s\nanzPub = sum(i,1,n,1)\n/s push("Alle",anzPub)\n/s\nanzAutorAll = sum(i,1,n,n[i].authorsCount)\n/s anzAutor = round(anzAutorAll/ anzPub)\n/s push("Alle",anzAutor)\n/s\nanzZit = sum(i,1,n,n[i].citesCount)\n/s push("Alle",anzZit)\n/s\nfirstAuthor = sum(i,1,n,n[i].isFirstAuthor ? 1 : 0)\n/s push("Alle",firstAuthor)\n/s\nzitProPub = round(anzZit/anzPub)\n/s push("Alle",zitProPub)\n/sserie("Alle","color","#333")\n/sserie("Alle","label color","#333")\n/sserie("Alle","stack","askdl")\n/schart("yaxis type","logarithmic")\n/schart("yaxis type","linear")\n/schart("yaxis type","logarithmic")'},
            {icon: "schedule", text: '\n/s chart("clear")\n/s chart("zoom","xy")\n/s chart("title","Zeitlicher Verlauf")\n/s\n/s orderByYear(a,b) = a.year - b.year\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\n/s\nfirstAuthor = sum(i,1,n,n[i].isFirstAuthor ? 1 : 0)\nlastAuthor = sum(i,1,n, and(n[i].isLastAuthor, not(n[i].isFirstAuthor)) ?  1  : 0)\n/s middleAuthor = author.publicationsCount - firstAuthor -lastAuthor\n/s push("Authortype",firstAuthor,"Erstauthor")\n/s push("Authortype",lastAuthor,"Letztautor")\n/s push("Authortype",middleAuthor,"Rest")\n/s\n/s serie("Authortype","type","pie")\n/s serie("Authortype","position","[100,50]")\n/s serie("Authortype","size","150")\n/s\n/s year1998 = sum(i,1,n,n[i].year == 1998 ? 1 : 0)\n/s quot1998 = sum(i,1,n,n[i].year == 1998 ? n[i].citesCount : 0)\n/s\n/s year1999 = sum(i,1,n,n[i].year == 1999 ? 1 : 0)\n/s quot1999 = sum(i,1,n,n[i].year == 1999 ? n[i].citesCount : 0)\n/s\n/s year2000 = sum(i,1,n,n[i].year == 2000 ? 1 : 0)\n/s quot2000 = sum(i,1,n,n[i].year == 2000 ? n[i].citesCount : 0)\n/s\n/s year2001 = sum(i,1,n,n[i].year == 2001 ? 1 : 0)\n/s quot2001 = sum(i,1,n,n[i].year == 2001 ? n[i].citesCount : 0)\n/s\n/s year2002 = sum(i,1,n,n[i].year == 2002 ? 1 : 0)\n/s quot2002 = sum(i,1,n,n[i].year == 2002 ? n[i].citesCount : 0)\n/s\n/s year2003 = sum(i,1,n,n[i].year == 2003 ? 1 : 0)\n/s quot2003 = sum(i,1,n,n[i].year == 2003 ? n[i].citesCount : 0)\n/s\n/s year2004 = sum(i,1,n,n[i].year == 2004 ? 1 : 0)\n/s quot2004 = sum(i,1,n,n[i].year == 2004 ? n[i].citesCount : 0)\n/s\n/s year2005 = sum(i,1,n,n[i].year == 2005 ? 1 : 0)\n/s quot2005 = sum(i,1,n,n[i].year == 2005 ? n[i].citesCount : 0)\n/s\n/s year2006 = sum(i,1,n,n[i].year == 2006 ? 1 : 0)\n/s quot2006 = sum(i,1,n,n[i].year == 2006 ? n[i].citesCount : 0)\n/s\n/s year2007 = sum(i,1,n,n[i].year == 2007 ? 1 : 0)\n/s quot2007 = sum(i,1,n,n[i].year == 2007 ? n[i].citesCount : 0)\n/s\n/s year2008 = sum(i,1,n,n[i].year == 2008 ? 1 : 0)\n/s quot2008 = sum(i,1,n,n[i].year == 2008 ? n[i].citesCount : 0)\n/s\n/s year2009 = sum(i,1,n,n[i].year == 2009 ? 1 : 0)\n/s quot2009 = sum(i,1,n,n[i].year == 2009 ? n[i].citesCount : 0)\n/s\n/s year2010 = sum(i,1,n,n[i].year == 2010 ? 1 : 0)\n/s quot2010 = sum(i,1,n,n[i].year == 2010 ? n[i].citesCount : 0)\n/s\n/s year2011 = sum(i,1,n,n[i].year == 2011 ? 1 : 0)\n/s quot2011 = sum(i,1,n,n[i].year == 2011 ? n[i].citesCount : 0)\n/s\n/s year2012 = sum(i,1,n,n[i].year == 2012 ? 1 : 0)\n/s quot2012 = sum(i,1,n,n[i].year == 2012 ? n[i].citesCount : 0)\n/s\n/s year2013 = sum(i,1,n,n[i].year == 2013 ? 1 : 0)\n/s quot2013 = sum(i,1,n,n[i].year == 2013 ? n[i].citesCount : 0)\n/s\n/s year2014 = sum(i,1,n,n[i].year == 2014 ? 1 : 0)\n/s quot2014 = sum(i,1,n,n[i].year == 2014 ? n[i].citesCount : 0)\n/s\n/s year2015 = sum(i,1,n,n[i].year == 2015 ? 1 : 0)\n/s quot2015 = sum(i,1,n,n[i].year == 2015 ? n[i].citesCount : 0)\n/s\n/s year2016 = sum(i,1,n,n[i].year == 2016 ? 1 : 0)\n/s quot2016 = sum(i,1,n,n[i].year == 2016 ? n[i].citesCount : 0)\n/s\n/s year2017 = sum(i,1,n,n[i].year == 2017 ? 1 : 0)\n/s quot2017 = sum(i,1,n,n[i].year == 2017 ? n[i].citesCount : 0)\n/s\n/s push("Publikationen",[year1998,year1999])\n/s push("Publikationen",[year2000,year2001,year2002,year2003,year2004,year2005,year2006,year2007,year2008,year2009])\n/s push("Publikationen",[year2010,year2011,year2012,year2013,year2014,year2015,year2016,year2017])\n/s\n/s push("Zitate",[quot1998,quot1999])\n/s push("Zitate",[quot2000,quot2001,quot2002,quot2003,quot2004,quot2005,quot2006,quot2007,quot2008,quot2009])\n/s push("Zitate",[quot2010,quot2011,quot2012,quot2013,quot2014,quot2015,quot2016,quot2017])\n/s\n/s serie("Zitate","stack","123")\n/s serie("Zitate","label color","#fff")\n/s serie("Zitate","color","#333")\n/s serie("Publikationen","color","rgb(0, 75, 90)")\n/s\n/s setXaxisValues(year) = chart("xaxis push value",year)\n/s sum(year,1997,2016,setXaxisValues(year)) \n/s chart("yaxis type","logarithmic")'},
            {icon: "star_border", text: '/s chart("clear")\n/s chart("icon","star_border")\n/s chart("title","Indices")\n/s chart("zoom","xy")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\nhIndex = sum(j,1,n,(n[j].citesCount) >= j ? 1:0)\nAR_index = sqrt(sum(j,1,hIndex, n[j].citesCount/ n[j].age))\nA_index = 1/hIndex *sum(j,1,hIndex,n[j].citesCount)\nR_index = sqrt(sum(j,1,hIndex, n[j].citesCount))\ng_index =sum(a,1,n,sum(k,1,a,n[k].citesCount) > a^2 ? 1 : 0)\nhg_index = sqrt(hIndex*g_index)\n/s largerThanSquare(j)  = n[j].citesCount >= j^2\nh2_index =sum(j,1,n, largerThanSquare(j) ? 1 : 0)\nm_index = mod(hIndex,2) != 0 ?   n[(hIndex+1)/2].citesCount : 1/2(n[(hIndex/2)].citesCount + n[(hIndex/2)+1].citesCount  )\nq2_index = sqrt(hIndex*m_index)\n/s h_T(j) = n[j].citesCount <= j ? n[j].citesCount/(2*j-1)+0 : j/(2j-1)+sum(k, j+1, n[j].citesCount,1/(2*k-1))+0\ntaperedIndex = sum(j,1,n,h_T(j))\nmQuotient = hIndex/author.scientificAge\n/s\n/s // h-index\n/s push("h-Index",hIndex)\n/s serie("h-Index","stack","hindex")\n/s serie("h-Index","label color","#fff")\n/s serie("h-Index","color","rgb(0,75,90")\n/s\n/s //AR_index\n/s push("AR_index",AR_index)\n/s serie("AR_index","stack","AR_index")\n/s serie("AR_index","label color","#fff")\n/s serie("AR_index","color","#f44336")\n/s\n/s //A_index\n/s push("A_index",A_index)\n/s serie("A_index","stack","A_index")\n/s serie("A_index","label color","#fff")\n/s serie("A_index","color"," #9c27b0")\n/s\n/s //R_index\n/s push("R_index",R_index)\n/s serie("R_index","stack","R_index")\n/s serie("R_index","label color","#fff")\n/s serie("R_index","color","#673ab7")\n/s\n/s //g_index\n/s push("g_index",g_index)\n/s serie("g_index","stack","g_index")\n/s serie("g_index","label color","#fff")\n/s serie("g_index","color","#3f51b5")\n/s\n/s //hg_index\n/s push("hg_index",hg_index)\n/s serie("hg_index","stack","hg_index")\n/s serie("hg_index","label color","#fff")\n/s serie("hg_index","color","#2196f3")\n/s\n/s //h2_index\n/s push("h2_index",h2_index)\n/s serie("h2_index","stack","h2_index")\n/s serie("h2_index","label color","#fff")\n/s serie("h2_index","color","#00bcd4")\n/s\n/s //m_index\n/s push("m_index",m_index)\n/s serie("m_index","stack","m_index")\n/s serie("m_index","label color","#fff")\n/s serie("m_index","color","#009688")\n/s\n/s //q2_index\n/s push("q2_index",q2_index)\n/s serie("q2_index","stack","q(2)index")\n/s serie("q2_index","label color","#fff")\n/s serie("q2_index","color","#4caf50")\n/s\n/s //taperedIndex\n/s push("taperedIndex",taperedIndex)\n/s serie("taperedIndex","stack","tapered h-Index")\n/s serie("taperedIndex","label color","#fff")\n/s serie("taperedIndex","color","#8bc34a")\n/s\n/s //mQuotient\n/s push("mQuotient",mQuotient)\n/s serie("mQuotient","stack","mQuotient")\n/s serie("mQuotient","label color","#fff")\n/s serie("mQuotient","color","#cddc39")'}





]
    },
    helpUrl: '/help/index.html'
});
