/*给p标签中的「银之匙」字样加上标记*/
(function() {
    $('p:contains("银之匙")').each(function() {
        $(this).replaceWith('<p>' + $(this).html().replace(/银之匙/g, '<span class="cat-and-sunflower">银之匙</span>') + '</p>');
    });
})();