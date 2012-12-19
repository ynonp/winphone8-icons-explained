/**
 * Created with JetBrains WebStorm.
 * User: ynonperek
 * Date: 12/18/12
 * Time: 10:57 PM
 * To change this template use File | Settings | File Templates.
 */

var ViewModel = function() {
    var self = this;

    self.icons = [ 'signal', 'cell', 'forward', 'roaming',
                   'wifi', 'bluetooth', 'profile', 'location',
                   'battery', 'clock' ];

    self.chosenPage     = ko.observable();
    self.chosenPageName = ko.observable();
    self.chosenPageIdx  = -1;
    self.prevPageIdx    = -1;

    self.goToPage = function( page ) {
        self.chosenPageName ( page );
        self.prevPageIdx   = self.chosenPageIdx;
        self.chosenPageIdx = self.icons.indexOf( page );

        self.chosenPage( document.getElementById( page ).innerHTML );
    };

    self.direction = function() {
        if ( ( self.chosenPageIdx < 0 ) || ( self.prevPageIdx < 0 ) ) {
            return '1';
        } else {
            return self.chosenPageIdx - self.prevPageIdx;
        }


    };
};

var prevClassForDirection = function( dir ) {
    return dir > 0 ? 'prev' : 'next';
};

var nextClassForDirection = function( dir ) {
    return dir > 0 ? 'next' : 'prev';
};

ko.bindingHandlers.animatedDiv = {
    init: function( element, valueAccessor, allBindingsAccessor, viewModle, context ) {
        viewModle._addingPage = 0;
    },

    update: function(element, valueAccessor, allBindingsAccessor, viewModle, context) {
        var value       = valueAccessor();

        var nextPage    = value.page;
        var currentPage = element.querySelector('.page');

        if ( ! nextPage ) { return; }

        if ( currentPage ) {
            currentPage.classList.add(prevClassForDirection(value.direction));
            setTimeout( function() {
                element.removeChild( currentPage );
            }, 500);
        }

        if ( viewModle._addingPage > 0 ) {
            element.innerHTML = '';
        }

        if ( nextPage ) {
            viewModle._addingPage += 1;
            var div = document.createElement('div');
            div.classList.add( nextClassForDirection(value.direction));
            div.classList.add('page');

            div.innerHTML = nextPage;
            element.appendChild(div);

            setTimeout(function() {
                div.classList.remove( nextClassForDirection(value.direction) );
            }, 0);
        }
    }
};

var vm = new ViewModel();

var hammer = new Hammer(document.body);
hammer.onswipe = function(ev) {
    var delta = 0;
    if ( ev.direction === 'right' ) {
        delta = -1;
    } else if ( ev.direction === 'left' ) {
        delta = 1;
    } else {
        return;
    }

    var idx = vm.icons.indexOf( vm.chosenPageName() );
    var nextIdx = idx + delta

    if ( nextIdx >= vm.icons.length ) {
        nextIdx = 0;
    } else if ( nextIdx < 0 ) {
        nextIdx = vm.icons.length - 1;
    }

    var nextPage = vm.icons[nextIdx];


    vm.goToPage( nextPage );
};

ko.applyBindings( vm );