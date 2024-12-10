document.addEventListener('DOMContentLoaded', function() {
    const iconSection = document.getElementById('icon-section');
    const iconPage2 = document.getElementById('icon-page2');
    const iconPage1 = document.getElementById('icon-page1');
    const textileIframe = document.getElementById('textile-iframe');
    const bottomMenu = document.getElementById('bottom-menu');
    let scrollTimeout;

    iconSection.addEventListener('scroll', function() {
        if (iconSection.scrollTop + iconSection.clientHeight >= iconSection.scrollHeight) {
            // User has scrolled to the bottom
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    iconPage2.click();
                }, 800); // 1 second delay
            }
        } else {
            // User has scrolled away from the bottom
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }
    });
        
    textileIframe.addEventListener('load', function() {
        const iframeDocument = textileIframe.contentDocument || textileIframe.contentWindow.document;
        const iframeBody = iframeDocument.getElementById('textile-body');

        if (iframeBody) {
            iframeBody.addEventListener('scroll', function() {
                if (iframeBody.scrollTop === 0) {
                    // User has scrolled to the top
                    if (!scrollTimeout) {
                        scrollTimeout = setTimeout(() => {
                            iconPage1.click();
                        }, 800); // 0.8 second delay
                    }
                } else {
                    // User has scrolled away from the top
                    clearTimeout(scrollTimeout);
                    scrollTimeout = null;
                }
            });
        }
    });
function updateBottomMenuClasses() {
    const currentPage = window.location.pathname + window.location.hash;
    console.log(currentPage)
    if (currentPage.includes('#t2')) {
        bottomMenu.classList.remove('bottom-menu-about');
        bottomMenu.classList.remove('bottom-menu-maps');
        //remove all class lists except for the bottom-menu-home
        bottomMenu.classList.add('bottom-menu-home');
    } else if (currentPage.includes('#t3')) {
        bottomMenu.classList.remove('bottom-menu-home');
        bottomMenu.classList.remove('bottom-menu-about');
        bottomMenu.classList.add('bottom-menu-maps');
    } else if (currentPage.includes('#t5')) {
        bottomMenu.classList.remove('bottom-menu-home');
        bottomMenu.classList.remove('bottom-menu-maps');
        bottomMenu.classList.add('bottom-menu-about');
    }
}

updateBottomMenuClasses();
window.addEventListener('hashchange', function() {
    updateBottomMenuClasses();
});

bottomMenu.addEventListener('click', function() {
    updateBottomMenuClasses();
});
});

