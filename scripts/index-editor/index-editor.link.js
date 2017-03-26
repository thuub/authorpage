function indexEditorLink($scope, element, attributes) {

    $scope.doFullscreenCalc = doFullscreenCalc;
    $scope.changeExamples = changeExamples;
    function doFullscreenCalc() {
        if (
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
        ) {
            $scope.setTab('showEditor')
            var elem = document.getElementById("index-calc");
            var isFUllscreen = (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement );
            if (isFUllscreen) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }

            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }
    }


    function changeExamples() {
        switch ($scope.example) {
            case "arindex":
                // $scope.editorInput = '\n/s chart("reset")\n/s chart("zoom","xy")\n/s authorA = [7,6,6,5,5,2,1,0,0,0]\n/s authorAAge = [1,4,3,1,2,3,6,6,1,2]\n/s authorB = [13,10,9,8,7,6,3,2,1,0]\n\n\nh = sum(k,1,authorA,(authorA[k] >= k) ? 1:0)\nAR_index = sqrt(sum(j,1,h, push("sum",authorA[j]/ authorAAge[j])))';
                $scope.editorInput = '/s chart("clear")\n/s chart("zoom","xy")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\n/s chart("title","AR-Index")\nhIndex = sum(j,1,n,(n[j].citesCount) >= j ? 1:0)\nAR_index = sqrt(sum(j,1,hIndex, push("sum",n[j].citesCount/ n[j].age)))';
                break;
            case "a-r-index":
                // $scope.editorInput = '\n/s chart("clear")\n/s chart("zoom","xy")\n/s chart("title","A- und R-Index")\n/s serie("quotesA","stack","1")\n/s serie("ZitateA","stack","2")\n/s serie("i^2","type","line")\n/s authorA = [14,11,8,8,6,3,3,2,1,0]\n/s authorB = [9,5,5,3,2,2,1,0,0,0]\n\nhIndex_A = sum(j,1,authorA,(push("ZitateA",authorA[j]) >= j) ? 1:0)\nhIndex_B = sum(j,1,authorB,(push("ZitateB",authorB[j]) >= j) ? 1:0)\n\nA_indexA = 1/hIndex_A *sum(j,1,hIndex_A,authorA[j])\nA_indexB = 1/hIndex_B *sum(j,1,hIndex_B,authorB[j])\n\nR_indexA = sqrt(sum(j,1,hIndex_A, authorA[j]))\nR_indexB = sqrt(sum(j,1,hIndex_B, authorB[j]))\n\n\n/s serie("Zitate","color","#4db6ac")\n/s serie("Zitate","label color","#333")\n//\n// Plotline Example\n//\n/s chart("yaxisPlotLineColor", "#00695c")\n/s chart("yaxisPlotLineWidth", 5)\n/s chart("yaxisPlotLineValue", R_indexA)\n/s chart("yaxisPlotLineLabel",R_indexA )\n/s chart("yaxisPlotLineDash", "Dash" )';
                $scope.editorInput = '/s chart("clear")\n/s chart("zoom","xy")\n/s chart("title","A- und R-Index")\n/s serie("Zitate","stack","2")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\nhIndex = sum(j,1,n,(push("Zitate",n[j].citesCount) >= j) ? 1:0)\n/s\nA_index = 1/hIndex *sum(j,1,hIndex,n[j].citesCount)\n\nR_index = sqrt(sum(j,1,hIndex, n[j].citesCount))\n/s\n/s serie("Zitate","color","#4db6ac")\n/s serie("Zitate","label color","#333")\n/s\n/s // Plotline Example\n/s chart("yaxisPlotLineColor", "#00695c")\n/s chart("yaxisPlotLineWidth", 3)\n/s chart("yaxisPlotLineValue", R_index)\n/s chart("yaxisPlotLineLabel",R_index )\n/s chart("yaxisPlotLineDash", "Dash" )';
                break;
            case "hindex":
                // $scope.editorInput = '\n// h-Index\nchart("clear")\nchart("title","h-Index")\nserie("ZitateB","stack","2")\nauthorA = [14,11,8,8,6,3,3,2,1,0]\nauthorB = [9,5,5,3,2,2,1,0,0,0]\nhIndex_A = sum(j,1,authorA,(push("ZitateA",authorA[j]) >= j) ? 1:0)\nhIndex_B = sum(j,1,authorB,(push("ZitateB",authorB[j]) >= j) ? 1:0)';
                // $scope.editorInput = '// h-Index\n/s chart("clear")\n/s chart("title","h-Index")\n/s serie("ZitateB","stack","2")\n/s authorA = [14,11,8,8,6,3,3,2,1,0]\n/s authorB = [9,5,5,3,2,2,1,0,0,0]\nhIndex_A = sum(j,1,authorA,(push("ZitateA",authorA[j]) >= j) ? 1:0)\nhIndex_B = sum(j,1,authorB,(push("ZitateB",authorB[j]) >= j) ? 1:0)';
                $scope.editorInput = '/s chart("clear")\n/s chart("zoom","xy")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\n/s chart("title","h-Index")\n    hIndex_A = sum(j,1,n,(push("ZitateA",n[j].citesCount) >= j) ? 1:0)';
                break;
            case "hgindex":
                // $scope.editorInput = '\n/s chart("clear")\n/s chart("zoom","xy")\n/s serie("sum","stack","rgb(0,75,90)")\n/s serie("a^2","type","line")\n/s n = [7,6,6,5,5,2,1,0,0,0]\n/s n = [13,10,9,8,7,6,3,2,1,0]\n// wenn der g-Index == Anzahl Elemente von n, dann ist er größer dementsprechend, n um nullen erweitern\n//n = resize(n, [20], 0);\n\ng_index =sum(a,1,n, push("sum",sum(k,1,a,n[k])) > push("a^2",a^2) ? 1 : 0)\nh_index = sum(k,1,n,(push("nk",n[k]) >= push("k",k)) ? push(" ",1):push(" ",0))\n\nhg_index = sqrt(h_index*g_index)';
                $scope.editorInput = '/s chart("clear")\n/s chart("zoom","xy")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount \n/s n = clone(author.publications)\n/s sort(n, orderByYear)\n/s chart("title","HG-Index")\n/sserie("sum","stack","3")\n/sserie("nk","stack","4")\n/sserie("k","stack","5")\n// wenn der g-Index == Anzahl Elemente von n, dann ist er größer dementsprechend, n um nullen erweitern\n//n = resize(n, [100], 0);\ng_index =sum(a,1,n, push("sum",sum(k,1,a,n[k].citesCount)) > push("a^2",a^2) ? 1 : 0)\n\nh_index = sum(k,1,n,(push("nk",n[k].citesCount) >= push("k",k)) ? 1:0)\n\nhg_index = sqrt(h_index*g_index)';
                break;
            case "h2index":
                // $scope.editorInput = '\n/s chart("clear")\n/s chart("zoom","xy")\n/s serie("sum","stack","rgb(0,75,90)")\n/s serie("j^2","type","scatter")\n/s authorA = [18,11,8,8,6,3,3,2,1,0]\n/s authorB = [9,5,5,3,2,2,1,0,0,0]\n\n\nlargerThanSquare(j)  = push("n[j]",authorA[j]) >= push("j^2",j^2)\nh2_index =sum(j,1,authorA, largerThanSquare(j) ? 1 : 0)\n\n// largerThanSquareB(j)  = push("n[j]",authorB[j]) >= push("j^2",j^2)\n// h2_index =sum(j,1,authorB, largerThanSquareB(j) ? 1 : 0)';
                $scope.editorInput = '/s chart("clear")\n/s chart("zoom","xy")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\n/s chart("title","h(2)-Index")\n/s serie("j^2","type","scatter")\nlargerThanSquare(j)  = push("n[j]",n[j].citesCount) >= push("j^2",j^2)\n\nh2_index =sum(j,1,n, largerThanSquare(j) ? 1 : 0)';
                break;
            case "gindex":
                // $scope.editorInput = '\n/s chart("clear")\n/s chart("zoom","xy")\n/s chart("title","g-Index")\n/s serie("quotesA","stack","1")\n/s serie("i^2","type","line")\n/s authorA = [14,11,8,8,6,3,3,2,1,0]\n/s authorB = [9,5,5,3,2,2,1,0,0,0]\n\n// wenn der g-Index == Anzahl Elemente von n, dann kann er größer sein. Dementsprechend, authorA / authorB um nullen erweitern\n//authorA = resize(authorA, [20], 0);\n//authorB = resize(authorB, [20], 0);\n\n\nallQuoteBeforeA(x) = sum(k,1,x,authorA[k])\nallQuoteBeforeB(x) = sum(k,1,x,authorB[k])\n\ng_index =sum(i,1,authorA, push("quotesA",allQuoteBeforeA(i)) >= i^2 ? 1 : 0)\ng_index =sum(i,1,authorB, push("quotesB",allQuoteBeforeB(i)) >= push("i^2",i^2) ? 1 : 0)';
                $scope.editorInput = '/s chart("clear")\n/s chart("zoom","xy")\n/s chart("title","g-Index")\n/s serie("quotes","stack","1")\n/s serie("i^2","type","line")\n/s serie("quotes","label color","#FFF")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\n// wenn der g-Index == Anzahl Elemente von n, dann kann er größer sein. Dementsprechend, authorA / authorB um nullen erweitern\n//authorA = resize(authorA, [20], 0);\n//authorB = resize(authorB, [20], 0);\nallQuoteBefore(x) = sum(k,1,x,n[k].citesCount)\n\ng_index =sum(i,1,n, push("quotes",allQuoteBefore(i)) >= push("i^2",i^2) ? 1 : 0)';
                break;
            case "q2ndex":
                // $scope.editorInput = '\n/s chart("clear")\n/s chart("zoom","xy")\n/s serie("sum","stack","1")\n/s serie(" ","stack","2")\n/s serie("a^2","type","line")\n/s authorA = [7,6,6,5,5,2,1,0,0,0]\n/s authorB = [13,10,9,8,7,6,3,2,1,0]\n\nh_indexA = sum(k,1,n,(push("authorA",authorA[k]) >= k) ? push(" ",1):push(" ",0))\n//h_indexB = sum(k,1,n,(push("authorA",authorA[k]) >= k) ? push(" ",1):push(" ",0))\n\nm_indexA = mod(h_indexA,2) != 0 ?   n[(h_indexA+1)/2] : 1/2(n[(h_indexA/2)] + n[(h_indexA/2)+1]  )\n//m_indexB = mod(h_indexB,2) != 0 ?   n[(h_indexB+1)/2] : 1/2(n[(h_indexB/2)] + n[(h_indexB/2)+1]  )\n\nq2_indexA = sqrt(h_indexA*m_indexA)\n//q2_indexB = sqrt(h_indexB*m_indexB)';
                $scope.editorInput = '/s chart("clear")\n/s chart("zoom","xy")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\n/s chart("title","q2-Index")\n/s serie(" ","stack",1)\n\nh_index = sum(k,1,n,(push("quotes",n[k].citesCount) >= k) ? push(" ",1):push(" ",0))\n\nm_index = mod(h_index,2) != 0 ?   n[(h_index+1)/2].citesCount : 1/2(n[(h_index/2)].citesCount + n[(h_index/2)+1].citesCount  )\n\nq2_indexA = sqrt(h_index*m_index)';
                break;
            case "mfindex":
                // $scope.editorInput = '\n/s chart("clear")\n/s chart("zoom","xy")\n/s serie("age","stack","1")\n/s serie("authors","stack","2")\ns_cit= 50\nf_j = 1.75\ntreshold_year = 10\ntresholdYearsCit_j = 10\n//sortieren der Autordaten nach Zitatanzahl in absteigender Reihen-folge\n/s sortPubByCitDesc(a,b) = b.citesCount - a.citesCount\n/s sort(author.publications, sortPubByCitDesc)\n/s // Publikationsdaten nach n kopieren\n/s //n = author.publications\n\nyears(age) = age <= treshold_year ? age : treshold_year\n\nam(citePublication) = citePublication.isForeign ? 1 :citePublication.isAssociate ? 1/4 :1/20\n\najk(citePublication) = 1 / size(citePublication.authors) * sum(m,1,size(citePublication.authors)[1],am(citePublication.authors[m]))\n\ncitjk(citePublication) = ajk(citePublication)/ years(citePublication.age)\n\ncitjk(author.publications[1].cites[1])\n\ncit_j(j) = s_cit * f_j *( 1/j.authorsCount) * (1/min(j.age,tresholdYearsCit_j))\n\ncalculateCitJ(j) = j.citj = push("citj",cit_j(j))\n\nforEach(author.publications,calculateCitJ)\n\nh_T(j) = round(author.publications[j].citj) <= j ? round(author.publications[j].citj)/(2*j-1) : j/(2j-1)+sum(k, j+1, round(author.publications[j].citj),1/(2*k-1))\n\nMF= sum(j,1,author.publications,h_T(j))\n\nplotAge(pub) = push("age",pub.age)\nforEach(author.publications,plotAge)\n\nplotAuthorsCount(pub) = push("authors",pub.authorsCount)\nforEach(author.publications,plotAuthorsCount)\n\npushxAxisLabel(pub) = chart("xaxis push value",pub.id-1)\nforEach(author.publications,pushxAxisLabel)';
                $scope.editorInput = '/s chart("clear")\n/s chart("zoom","xy")\n/s serie("age","stack","1")\n/s serie("authors","stack","2")\ns_cit= 50\nf_j = 1.75\ns_y=20\ntreshold_year = 10\n/s //sortieren der Autordaten nach Zitatanzahl in absteigender Reihen-folge\n/s sortPubByCitDesc(a,b) = b.citesCount - a.citesCount\n/s sort(author.publications, sortPubByCitDesc)\n/s // Publikationsdaten nach n kopieren\n/s //n = author.publications\n/s\n/s years(age) = age <= treshold_year ? age : treshold_year\n/s\nam(citePublication) = citePublication.isForeign ? 1 :citePublication.isAssociate ? 1/4 :1/20\najk(citePublication) = 1 / size(citePublication.authors) * sum(m,1,size(citePublication.authors)[1],am(citePublication.authors[m]))\ncitjk(citePublication) = ajk(citePublication)/ years(citePublication.age)\ncit_j(j) = s_cit * f_j *( 1/j.authorsCount) * (1/min(j.age,treshold_year)) * sum(a,1,j.citesCount,citjk(j.cites[a]))\n/s calculateCitJ(j) = j.citj = push("citj",cit_j(j))\n/s\n/s forEach(author.publications,calculateCitJ)\n/s\nh_T(j) = round(author.publications[j].citj) <= j ? round(author.publications[j].citj)/(2*j-1) : j/(2j-1)+sum(k, j+1, round(author.publications[j].citj),1/(2*k-1))\n/s\nMF= s_y * (sum(j,1,author.publications,h_T(j))/author.scientificAge)\n/s\n/s plotAge(pub) = push("age",pub.age)\n/s forEach(author.publications,plotAge)\n/s\n/s plotAuthorsCount(pub) = push("authors",pub.authorsCount)\n/s forEach(author.publications,plotAuthorsCount)\n/s\n/s pushxAxisLabel(pub) = chart("xaxis push value",pub.id-1)\n/s forEach(author.publications,pushxAxisLabel)\n/s plotCites(pub) = push("Zitate",pub.citesCount)\n/s forEach(author.publications,plotCites)\n/s serie("Zitate","stack","aslkdj")';
                break;
            case "tapered":
                // $scope.editorInput = '\n/s chart("reset")\n/s chart("zoom","xy")\n/s authorA = [7,6,6,5,5,2,1,0,0,0]\n/s authorB = [13,10,9,8,7,6,3,2,1,0]\n\n\nh_Ta(j) = authorA[j] <= j ? push("<j",authorA[j]/(2*j-1))+push(">j",0) : push(">j",j/(2j-1)+sum(k, j+1, authorA[j],1/(2*k-1))+push("<j",0))\n/s h_Tb(j) = authorB[j] <= j ? authorB[j]/(2*j-1) : j/(2j-1)+sum(k, j+1, authorB[j],1/(2*k-1))\n\ntaperedIndex = sum(j,1,authorA,h_Ta(j))\n/s taperedIndex = sum(j,1,authorB,h_Tb(j))\n\ntaperedIndex = sum(j,1,authorB,h_Tb(j))';
                $scope.editorInput = '/s chart("clear")\n/s chart("zoom","xy")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\n/s chart("title","tapered h-Index")\n\nh_T(j) = n[j].citesCount <= j ? push("<j",n[j].citesCount/(2*j-1))+push(">j",0) : push(">j",j/(2j-1)+sum(k, j+1, n[j].citesCount,1/(2*k-1))+push("<j",0))\n\ntaperedIndex = sum(j,1,n,h_T(j))';
                break;
            case "mindex":
                // $scope.editorInput = '\n/s chart("reset")\n/s chart("zoom","xy")\n/s chart("title","m-Index")\n/s n = [7,6,6,5,5,2,1,0,0]\n    /s n = [13,10,9,8,7,6,3,2,1,0]\n\n// serie("nk","stack","0")\nserie("k","stack","1")\nserie(" ","stack","2")\n\n\nh_index = sum(k,1,n,(push("nk",n[k]) >= push("k",k)) ? push(" ",1):push(" ",0))\n\n// m_index = mod(h_index,2) != 0 ?   n[(h_index+1)/2] : 1/2(n[(h_index/2)] + n[(h_index/2)+1]  )\n\n\neven() = n[(h_index+1)/2]\nodd() = 1/2(n[(h_index/2)] + n[(h_index/2)+1])\nm_index = mod(h_index,2) != 0 ?   even() : odd()';
                $scope.editorInput = '\n/s chart("reset")\n/s chart("zoom","xy")\n/s chart("title","m-Index")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\n/s serie("k","stack","1")\n/s serie(" ","stack","2")\n\nh_index = sum(k,1,n,(push("quotes",n[k].citesCount) >= push("k",k)) ? push(" ",1):push(" ",0))\n    /s// m_index = mod(h_index,2) != 0 ?   n[(h_index+1)/2] : 1/2(n[(h_index/2)] + n[(h_index/2)+1]  )\n\neven() = n[(h_index+1).citesCount/2]\nodd() = 1/2(n[(h_index/2)].citesCount + n[(h_index/2)+1].citesCount)\nm_index = mod(h_index,2) != 0 ?   even() : odd()';
                break;
            case "mquotient":
                // $scope.editorInput = '\n/s chart("reset")\n/s chart("zoom","xy")\n/s n = [7,6,6,5,5,2,1,0,0]\n\n/s authorA = [7,6,6,5,5,2,1,0,0,0]\n/s authorB = [13,10,9,8,7,6,3,2,1,0]\nauthorAAge = 7\nauthorBAge = 5\n\nh = sum(k,1,authorA,(authorA[k] >= k) ? 1:0)\nmQuotient = h/authorAAge\n\nplotSerie(value) = push("mQuotient/per scientificAge",h/value)\nsum(j,1,authorAAge,plotSerie(j) )';
                $scope.editorInput = '/s chart("clear")\n/s chart("zoom","xy")\n/s //absteigend sortieren\n/s orderByYear(a,b) = b.citesCount - a.citesCount\n/s n = clone(author.publications)\n/s sort(n, orderByYear)\n/s chart("title","m-Quotient")\nhIndex = sum(j,1,n,(push("Zitate",n[j].citesCount) >= j) ? 1:0)\n/s\n/s authorA = [7,6,6,5,5,2,1,0,0,0]\n/s authorB = [13,10,9,8,7,6,3,2,1,0]\nauthorAAge = 7\nauthorBAge = 5\n/s\nmQuotient = hIndex/author.scientificAge\n/s\n/s\n/s chart("xaxis plotLine width",2)\n/s chart("xaxis plotLine value",h)\n/s chart("xaxis plotLine label",h)\n/s chart("xaxis plotLine color","rgb(75,90,0)")';
                break;
            case "sortieren" :
                $scope.editorInput = '\norderByYear(a,b) = a.year - b.year\n/s n = clone(author.publications)\n/s sort(n, orderByYear)';
                break;
            default:
                for (var i in $scope.SETTINGS_INDEX_CALCULATOR.additionalExamples) {
                    if (i == $scope.example) {
                        $scope.editorInput = $scope.SETTINGS_INDEX_CALCULATOR.additionalExamples[i];
                        break;
                    }
                }
        }
        $scope.evaluate();
    }


}