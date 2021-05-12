var BAR_ID = 'PROGRESS_BAR_ID';
var BAR_HEIGHT = 10; 

function onInstall(e) {
  onOpen(e);
}
//function for any processes that must happen upon opening or installing the app
function onOpen(e){
  //Add Menu which adds button to show a sidebar
  SlidesApp.getUi().createMenu('Interactive elements').addItem('Show Sidebar', 'showSidebar').addToUi();
  //drawButton();
}
function showSidebar(){
  //linked to Page.html 
  var html = HtmlService.createHtmlOutputFromFile('Page').setTitle('Interatice Learning Tool');
      SlidesApp.getUi().showSidebar(html);
}
function infiniteClone(){
  //get selected element
  var selection = SlidesApp.getActivePresentation().getSelection();
  var selectionType = selection.getSelectionType();
  var texts = [];
  switch (selectionType){
    //if selection is page element, insert another page element onto current slide, (I think this includes shapes?)
    case SlidesApp.SelectionType.PAGE_ELEMENT:
      var currentSlide = SlidesApp.getActivePresentation.getSlides()[0];
      var pageElement = selection.getPageElementRange().getPageElements();
      currentSlide.insertPageElement(pageElement);
      break;
    //if selection is text, insert copy of text into a text box on current slide
    case SlidesApp.SelectionType.TEXT:
      var currentSlide = SlidesApp.getActivePresentation.getSlides()[0];
      var text = selection.getPageElementRange().getPageElements().forEach(function(element) {
        texts.push(element.asShape().getText()); });
      currentSlide.insertTextBox(texts);
      break;
  }

}

//insert special characters 
function specialChars(spchar){
  
  var selection = SlidesApp.getActivePresentation().getSelection();
  
  selection.getTextRange().appendText(spchar);
  
}


//Translate Element
function getElementTexts(elements) {
  var texts = [];
  elements.forEach(function(element) {
    switch (element.getPageElementType()) {
      case SlidesApp.PageElementType.GROUP:
        element.asGroup().getChildren().forEach(function(child) {
          texts = texts.concat(getElementTexts(child));
        });
        break;
      case SlidesApp.PageElementType.TABLE:
        var table = element.asTable();
        for (var y = 0; y < table.getNumColumns(); ++y) {
          for (var x = 0; x < table.getNumRows(); ++x) {
            texts.push(table.getCell(x, y).getText());
          }
        }
        break;
      case SlidesApp.PageElementType.SHAPE:
        texts.push(element.asShape().getText());
        break;
    }
  });
  return texts;
}
function translateSelectedElements(targetLanguage) {
  // Get selected elements.
  var selection = SlidesApp.getActivePresentation().getSelection();
  var selectionType = selection.getSelectionType();
  var texts = [];
  switch (selectionType) {
    case SlidesApp.SelectionType.PAGE:
      var pages = selection.getPageRange().getPages().forEach(function(page) {
        texts = texts.concat(getElementTexts(page.getPageElements()));
      });
    break;
    case SlidesApp.SelectionType.PAGE_ELEMENT:
      var pageElements = selection.getPageElementRange().getPageElements();
      texts = texts.concat(getElementTexts(pageElements));
    break;
    case SlidesApp.SelectionType.TABLE_CELL:
      var cells = selection.getTableCellRange().getTableCells().forEach(function(cell) {
        texts.push(cell.getText());
      });
    break;
    case SlidesApp.SelectionType.TEXT:
      var elements = selection.getPageElementRange().getPageElements().forEach(function(element) {
        texts.push(element.asShape().getText());
      });
    break;
  }

  // Translate all elements in-place.
  texts.forEach(function(text) {
    text.setText(LanguageApp.translate(text.asRenderedString(), '', targetLanguage));
  });

  return texts.length;
}

//Progress Bar Section
//Add progress bar function
function createBars() {
  deleteBars(); // Delete any existing progress bars
  var presentation = SlidesApp.getActivePresentation();
  var slides = presentation.getSlides();
  for (var i = 0; i < slides.length; ++i) {
    var ratioComplete = (i / (slides.length - 1));
    var x = 0;
    var y = presentation.getPageHeight() - BAR_HEIGHT;
    var barWidth = presentation.getPageWidth() * ratioComplete;
    if (barWidth > 0) {
      var bar = slides[i].insertShape(SlidesApp.ShapeType.RECTANGLE, x, y,
                                      barWidth, BAR_HEIGHT);
      bar.getBorder().setTransparent();
      bar.setLinkUrl(BAR_ID);
    }
  }
}

/**
 * Deletes all progress bar rectangles.
 */
function deleteBars() {
  var presentation = SlidesApp.getActivePresentation();
  var slides = presentation.getSlides();
  for (var i = 0; i < slides.length; ++i) {
    var elements = slides[i].getPageElements();
    for (var j = 0; j < elements.length; ++j) {
      var el = elements[j];
      if (el.getPageElementType() === SlidesApp.PageElementType.SHAPE &&
          el.asShape().getLink() &&
          el.asShape().getLink().getUrl() === BAR_ID) {
        el.remove();
      }
    }
  }
}

function clone(){

  shape = SlidesApp.getActivePresentation().getSelection();
  shape.duplicate();
}
