/**
 * Created by Han on 20.09.2016.
 */
"use strict";
function svElementLoader() {
    return {
        restrict: "AE",
        transclude: false,
        // template: '<div ng-if="show" class="bubbles"><span></span><span class="bubble2"></span><span class="bubble3"></span> </div>',
        // template: '<div ng-if="show" class="cssload-dots"> <div class="cssload-dot"></div> <div class="cssload-dot"></div> <div class="cssload-dot"></div> <div class="cssload-dot"></div> <div class="cssload-dot"></div> </div> <svg ng-if="show"version="1.1" xmlns="http://www.w3.org/2000/svg"> <defs> <filter id="goo"> <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="12" ></feGaussianBlur> <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0	0 1 0 0 0	0 0 1 0 0	0 0 0 18 -7" result="goo" ></feColorMatrix> <!--<feBlend in2="goo" in="SourceGraphic" result="mix" ></feBlend>--> </filter> </defs> </svg>',
        template: '<div ng-if="show" class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div></div> <div ng-if="show" style="margin: -40px auto 15px; text-align: center"> {{message}}</div>',
        scope: {
            show: "=",
            message: "=",
            publinId : "="
        }
    };
}
sv.directive('svElementLoader', svElementLoader);



