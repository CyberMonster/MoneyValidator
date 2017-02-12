function MoneyValidator(e, Control, MinValue)
{
    //Начальное положение курсора
    var StartSelectionStart = getCaretPosition(Control).start;
    //Первичный текст
    var ControlText = Control.value;
    //Длинна не валидной последовательности
    var ControlValueLength = ControlText.length;
    Control.value = "";

    //Удаление всех не валидных символов
    ControlText = RegExOnNumbersOnly(ControlText);

///Dots and spaces maker
    //Подпись номинала поля
    var Sign = "USD";
    //Для того, чтобы могли вводить номинал/подпись не зеркально
    var ProcessResultText = Sign.split("").reverse().join("");

    //Количество знаков до первого разделителя
    var FirstDelimItemsCount = 2;
    //Количество знаков до последующих разделичелей
    var NextDelimItemsCount = 3;
    //Разделитель младших разрядов
    var FirstDelim = ".";
    //Разделитель старших разрядов
    var SecondDelim = ",";

    var ItemsBeforeDelim = FirstDelimItemsCount;
    var FirstRun = true;
    var IsImportant = false;
    var BufferForText = "";

    //Удаление незначимых нулей
    for (var i = 0; i < ControlText.length; ++i)
    {
        if (ControlText[i] != 0 || IsImportant)
        {
            BufferForText += ControlText[i];
            IsImportant = true;
        }
    }
    ControlText = BufferForText;

    //Добавление незначимых нулей
    for (var i = ControlText.length; i <= FirstDelimItemsCount; ++i)
    {
        ControlText = "0" + ControlText;
    }

    //Правка положения курсора на минимальный размер текста
    if ((StartSelectionStart - (ControlValueLength - ProcessResultText.length)) > 0)
    {
        StartSelectionStart -= (StartSelectionStart - (ControlValueLength - ProcessResultText.length));
    }

    //Проверка на "первый ввод"
    if ((ControlValueLength <= ProcessResultText.length && ControlText.length > 0) || StartSelectionStart < 0)
    {
        StartSelectionStart = FirstDelimItemsCount + FirstDelim.length;
    }

    //Формирование выходной строки
    for (var i = (ControlText.length - 1); i >= 0; --i)
    {
        if (ItemsBeforeDelim <= 0)
        {
            //Количество знаков до разделителя
            ItemsBeforeDelim = NextDelimItemsCount;
            if (FirstRun)
            {
                FirstRun = false;
                ProcessResultText += FirstDelim;
            }
            else
            {
                ProcessResultText += SecondDelim;
            }
        }
        ProcessResultText += ControlText[i];
        --ItemsBeforeDelim;
    }

    Control.value = ProcessResultText.split("").reverse().join("");

    //Проверяем, не добавлен ли символ разделения
    if (Control.value.length != ControlValueLength && ((Control.value.length - ControlValueLength) != -1))
    {
        ++StartSelectionStart;
    }
    else
    {
        //Проверяем, не был ли нажат не валидный символ
        if ((Control.value.length - ControlValueLength) == -1)
        {
            --StartSelectionStart;
        }
    }

    //Проверка положения курсора на допустимость максимальному значению
    if (StartSelectionStart > (Control.value.length - Sign.length))
    {
        StartSelectionStart = Control.value.length - Sign.length;
    }

    //Установка курсора в начальное положение
    setCaretPosition(Control, StartSelectionStart, StartSelectionStart);
}

function MoneyCheckBeforeSendOnServer(e, Control, MinValue)
{
    Control.value = RegExOnNumbersOnly(Control.value)
    if (Control.value <= 0)
    {
        Control.value = 1;
    }
    MoneyValidator(e, Control, MinValue);
}

function RegExOnNumbersOnly(Text)
{
    return Text.replace(/[^0-9]/g, "");
}

function NumberValidator(e, Control, MinValue)
{
    //Начальное положение курсора
    var StartSelectionStart = getCaretPosition(Control).start;
    var ControlText = Control.value;
    //Длинна не валидной последовательности
    var ControlValueLength = ControlText.length;
    Control.value = "";

    //Удаление всех не валидных символов
    ControlText = RegExOnNumbersOnly(ControlText)

    //Проверяем, не был ли нажат не валидный символ
    if (ControlText.length < ControlValueLength)
    {
        --StartSelectionStart;
    }

    if (ControlText.length <= 0)
    {
        StartSelectionStart = Control.value.length;
    }
    else
    {
        Control.value = ControlText;
    }

    //Установка курсора в начальное положение
    setCaretPosition(Control, StartSelectionStart, StartSelectionStart);
}

function getCaretPosition(ctrl)
{
    // IE < 9 Support
    if (document.selection)
    {
        ctrl.focus();
        var range = document.selection.createRange();
        var rangelen = range.text.length;
        range.moveStart ("character", -ctrl.value.length);
        var start = range.text.length - rangelen;
        return {"start": start, "end": start + rangelen};
    }
    // IE >=9 and other browsers
    else
    {
        if (ctrl.selectionStart || ctrl.selectionStart == "0")
        {
            return {"start": ctrl.selectionStart, "end": ctrl.selectionEnd };
        }
        else
        {
            return {"start": 0, "end": 0};
        }
    }
}

function setCaretPosition(ctrl, start, end)
{
    // IE >= 9 and other browsers
    if(ctrl.setSelectionRange)
    {
        ctrl.focus();
        ctrl.setSelectionRange(start, end);
    }
    // IE < 9
    else
    {
        if (ctrl.createTextRange)
        {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd("character", end);
            range.moveStart("character", start);
            range.select();
        }
    }
}