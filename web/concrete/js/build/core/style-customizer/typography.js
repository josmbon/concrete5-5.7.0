/**
 * block ajax
 */

!function(global, $) {
    'use strict';

    function ConcreteTypographySelector($element, options) {
        'use strict';
        var my = this,
            options = $.extend({
                'inputName': false,
                'value': {}
            }, options);

        ConcreteStyleCustomizerPalette.call(my, $element, options);

        my.$fontMenu = my.$widget.find('select[data-style-customizer-field=font]');
        my.$sliders = my.$widget.find('div.ccm-style-customizer-slider');

        my.$sliders.slider({
            min: 0,
            max: 64,
            value: 0,
            create: function (e, ui) {
                $(this).parent().find('span.ccm-style-customizer-slider-value span.ccm-style-customizer-number').html('0');
            },
            slide: function (e, ui) {
                $(this).parent().find('span.ccm-style-customizer-slider-value span.ccm-style-customizer-number').html(ui.value);
            }
        });

        my.$colorpicker = my.$widget.find('input[data-style-customizer-field=color]');
        my.$colorpicker.spectrum({
            'preferredFormat': 'rgb',
            'showAlpha': true
        });

        my.$fontMenu.on('change', function() {
            var font = $(this).val();
            $(this).css('font-family', font);
        });

        $.each(my.fonts, function(i, font) {
            my.$fontMenu.append('<option value="' + font + '">' + font + '</option>');
        });

        if (my.options.value.fontFamily) {
            my.$fontMenu.val(my.options.value.fontFamily);
            my.setValue('font-family', my.options.value.fontFamily);
        }

        if (my.options.value.color) {
            my.$colorpicker.spectrum('set', my.options.value.color);
            my.setValue('color', my.options.value.color);
        }

        if (my.options.value.underline) {
            my.$widget.find('input[data-style-customizer-field=underline]').prop('checked', true);
            my.setValue('underline', '1');
        }

        if (my.options.value.uppercase) {
            my.$widget.find('input[data-style-customizer-field=uppercase]').prop('checked', true);
            my.setValue('uppercase', '1');
        }

        if (my.options.value.italic) {
            my.$widget.find('input[data-style-customizer-field=italic]').prop('checked', true);
            my.setValue('italic', '1');
        }

        if (my.options.value.bold) {
            my.$widget.find('input[data-style-customizer-field=bold]').prop('checked', true);
            my.setValue('bold', '1');
        }

        if (my.options.value.fontSize) {
            var $field = my.$widget.find('div[data-style-customizer-field=font-size]');
            var $slider = $field.find('div.ccm-style-customizer-slider');
            $slider.slider('value', my.options.value.fontSize.value);
            $field.find('span.ccm-style-customizer-slider-value span.ccm-style-customizer-number').html(my.options.value.fontSize.value);
            $field.find('span.ccm-style-customizer-slider-value span.ccm-style-customizer-unit').html(my.options.value.fontSize.unit);
            my.setValue('font-size', my.options.value.fontSize.value);
        }
        if (my.options.value.letterSpacing) {
            var $field = my.$widget.find('div[data-style-customizer-field=letter-spacing]');
            var $slider = $field.find('div.ccm-style-customizer-slider');
            $slider.slider('value', my.options.value.letterSpacing.value);
            $field.find('span.ccm-style-customizer-slider-value span.ccm-style-customizer-number').html(my.options.value.letterSpacing.value);
            $field.find('span.ccm-style-customizer-slider-value span.ccm-style-customizer-unit').html(my.options.value.letterSpacing.unit);
            my.setValue('letter-spacing', my.options.value.letterSpacing.value);
        }

        if (my.options.value.lineHeight) {
            var $field = my.$widget.find('div[data-style-customizer-field=line-height]');
            var $slider = $field.find('div.ccm-style-customizer-slider');
            $slider.slider('value', my.options.value.lineHeight.value);
            $field.find('span.ccm-style-customizer-slider-value span.ccm-style-customizer-number').html(my.options.value.lineHeight.value);
            $field.find('span.ccm-style-customizer-slider-value span.ccm-style-customizer-unit').html(my.options.value.lineHeight.unit);
            my.setValue('line-height', my.options.value.lineHeight.value);
        }

        my.updateSwatch();

    }

    ConcreteTypographySelector.prototype = Object.create(ConcreteStyleCustomizerPalette.prototype);

    ConcreteTypographySelector.prototype.fonts = ['Arial','Helvetica', 'Georgia', 'Verdana', 'Trebuchet MS', 'Book Antiqua', 'Tahoma', 'Times New Roman', 'Courier New', 'Arial Black', 'Comic Sans MS'],
    ConcreteTypographySelector.prototype.chooseTemplate = '<div class="ccm-style-customizer-typography-swatch-wrapper" data-launch="style-customizer-palette">' +
        '<input type="hidden" name="<%=options.inputName%>[font-family]" data-style-customizer-input="font-family" />' +
        '<input type="hidden" name="<%=options.inputName%>[color]" data-style-customizer-input="color" />' +
        '<input type="hidden" name="<%=options.inputName%>[bold]" data-style-customizer-input="bold" />' +
        '<input type="hidden" name="<%=options.inputName%>[italic]" data-style-customizer-input="italic" />' +
        '<input type="hidden" name="<%=options.inputName%>[underline]" data-style-customizer-input="underline" />' +
        '<input type="hidden" name="<%=options.inputName%>[uppercase]" data-style-customizer-input="uppercase" />' +
        '<input type="hidden" name="<%=options.inputName%>[font-size]" data-style-customizer-input="font-size" />' +
        '<input type="hidden" name="<%=options.inputName%>[letter-spacing]" data-style-customizer-input="letter-spacing" />' +
        '<input type="hidden" name="<%=options.inputName%>[line-height]" data-style-customizer-input="line-height" />' +
        '<span class="ccm-style-customizer-typography-swatch">T</span></div>',

    ConcreteTypographySelector.prototype.selectorWidgetTemplate = '<div class="ccm-ui ccm-style-customizer-palette">' +
        '<div><select data-style-customizer-field="font"><option value="">Choose Font</option></select> <input type="text" data-style-customizer-field="color"></div>' +
        '<div class="checkbox"><label><input type="checkbox" class="ccm-flat-checkbox" data-style-customizer-field="bold"> Bold</label></div>' +
        '<div class="checkbox"><label><input type="checkbox" class="ccm-flat-checkbox" data-style-customizer-field="italic"> Italic</label></div>' +
        '<div class="checkbox"><label><input type="checkbox" class="ccm-flat-checkbox" data-style-customizer-field="underline"> Underline</label></div>' +
        '<div class="checkbox"><label><input type="checkbox" class="ccm-flat-checkbox" data-style-customizer-field="uppercase"> Uppercase</label></div>' +
        '<div><label>Font Size</label><div data-style-customizer-field="font-size"><div class="ccm-style-customizer-slider"></div><span class="ccm-style-customizer-slider-value"><span class="ccm-style-customizer-number"></span><span class="ccm-style-customizer-unit">px</span></span></div></div>' +
        '<div><label>Letter Spacing</label><div data-style-customizer-field="letter-spacing"><div class="ccm-style-customizer-slider"></div><span class="ccm-style-customizer-slider-value"><span class="ccm-style-customizer-number"></span><span class="ccm-style-customizer-unit">px</span></span></div></div>' +
        '<div><label>Line Height</label><div data-style-customizer-field="line-height"><div class="ccm-style-customizer-slider"></div><span class="ccm-style-customizer-slider-value"><span class="ccm-style-customizer-number"></span><span class="ccm-style-customizer-unit">px</span></span></div></div>' +
        '<div class="ccm-style-customizer-palette-actions"><button class="btn btn-primary">Save</button></div>' +
        '</div>';

    ConcreteTypographySelector.prototype.updateSwatch = function() {
        var my = this,
            $swatch = my.$element.find('span.ccm-style-customizer-typography-swatch');

        $swatch.css('font-family', my.getValue('font-family'));
        $swatch.css('color', my.getValue('color'));
        $swatch.css('font-weight', 'inherit');
        $swatch.css('font-style', 'inherit');
        $swatch.css('text-decoration', 'inherit');
        $swatch.css('text-transform', 'inherit');

        if (my.getValue('bold') === '1') {
            $swatch.css('font-weight', 'bold');
        }
        if (my.getValue('italic') === '1') {
            $swatch.css('font-style', 'italic');
        }
        if (my.getValue('underline') === '1') {
            $swatch.css('text-decoration', 'underline');
        }
        if (my.getValue('uppercase') === '1') {
            $swatch.css('text-transform', 'uppercase');
        }
        $swatch.css('line-height', my.getValue('line-height') + my.options.unit);
        $swatch.css('letter-spacing', my.getValue('letter-spacing') + my.options.unit);
        $swatch.css('font-size', my.getValue('font-size') + my.options.unit);

    }

    ConcreteTypographySelector.prototype.save = function (e) {
        var my = this;
        my.setValue('font-family', my.$fontMenu.val());
        my.setValue('color', my.$widget.find('input[data-style-customizer-field=color]').spectrum('get'));
        my.setValue('bold', my.$widget.find('input[data-style-customizer-field=bold]').is(':checked') ? '1' : 0);
        my.setValue('italic', my.$widget.find('input[data-style-customizer-field=italic]').is(':checked') ? '1' : 0);
        my.setValue('underline', my.$widget.find('input[data-style-customizer-field=underline]').is(':checked') ? '1' : 0);
        my.setValue('uppercase', my.$widget.find('input[data-style-customizer-field=uppercase]').is(':checked') ? '1' : 0);
        my.setValue('font-size', my.$widget.find('div[data-style-customizer-field=font-size] div.ccm-style-customizer-slider').slider('value'));
        my.setValue('letter-spacing', my.$widget.find('div[data-style-customizer-field=letter-spacing] div.ccm-style-customizer-slider').slider('value'));
        my.setValue('line-height', my.$widget.find('div[data-style-customizer-field=line-height] div.ccm-style-customizer-slider').slider('value'));
        my.updateSwatch();
        ConcreteEvent.publish('StyleCustomizerSave');
        my.closeSelector(e);
    }

    // jQuery Plugin
    $.fn.concreteTypographySelector = function(options) {
        return $.each($(this), function(i, obj) {
            new ConcreteTypographySelector($(this), options);
        });
    }

    global.ConcreteTypographySelector = ConcreteTypographySelector;

}(this, $);