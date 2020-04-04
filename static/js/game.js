function plural(forms, n) {
    let idx;
    if (n % 10 === 1 && n % 100 !== 11) {
        idx = 0; // many
    } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
        idx = 1; // few
    } else {
        idx = 2; // one
    }
    return forms[idx] || '';
}

$(function() {
    var virusCounter = 0;
    var timeCounter = 0;
    var gameDuration = 5 * 1000;
    var delta = 20;
    var width = window.innerWidth - delta;
    var height = window.innerHeight - delta;

    var counter = $('.counter');

    function createVirus() {
        var x = Math.round(Math.random() * width) + delta / 2;
        var y = Math.round(Math.random() * height) + delta / 2;
        var scale = Math.random() / 2 + 0.5;
        return $('<div class="virus"></div>').css('transform', 'translate(' + x + 'px, ' + y + 'px' + ') scale(' + scale + ')');
    }

    function clearVirus() {
        $('.virus-pack').remove();
    }

    function createPackVirus() {
        var packVirus = $('<div class="virus-pack"></div>'),
            virus;
        for (var i = 0; i < 10; i++) {
            virus = createVirus();
            packVirus.append(virus);
        }
        return packVirus;
    }

    function startGame(container) {
        virusCounter = 0;
        clearVirus();
        counter.text(Math.round(gameDuration / 1000));
        var viruses = createPackVirus();
        container.append(viruses);
        var interval = setInterval(function() {
            var object = createVirus();
            viruses.append(object);
        }, 0.5 * 1000);
        var counterInterval = setInterval(function() {
            timeCounter += 1000;
            var diff = Math.round((gameDuration - timeCounter) / 1000);
            counter.text(diff >= 0 ? diff :  0 );
        }, 1000);
        setTimeout(function() {
            clearInterval(interval);
            clearInterval(counterInterval);
            showEndModal();
        }, gameDuration);
    }

    function showEndModal () {
        $('.overlay').addClass('shown');
        $('.modal-end__text').html(
            'Вы ликвидировали ' + virusCounter + ' ' + plural(['вирус', 'вируса', 'вирусов'], virusCounter) + 
            '<br>Твоя скорость ' + (virusCounter / gameDuration * 1000).toFixed(1) + ' вирусов в секунду'
        );
    }

    $('.main-page__start').on('click', function(event) {
        event.preventDefault();
        $('.page-1').removeClass('active');
        $('.page-2').addClass('active');
        startGame($('.page-2'));
    });

   $('body').on('click', '.virus', function() {
        $(this).addClass('deleted').remove();
        var audio = new Audio('static/audio/hit.mp3');
        audio.play();
        virusCounter += 1;
    });

    $('body').on('click', '.modal-end__start', function(event) {
        event.preventDefault();
        $('.overlay').removeClass('shown');
        $('.page-2').removeClass('active');
        $('.page-1').addClass('active');
    });

});