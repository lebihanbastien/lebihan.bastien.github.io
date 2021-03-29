## Liquid tag 'maincolumn-figure' used to add image data that fits within the
## main column area of the layout
## Usage {% maincolumn 'path/to/image' 'This is the caption' %}
#
module Jekyll
  class RenderMainColumnJsTag < Liquid::Tag

  	require "shellwords"
    require "kramdown"

    def initialize(tag_name, text, tokens)
      super
      @text = text.shellsplit
    end

    def render(context)

      # Gather settings
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)

      baseurl = context.registers[:site].config['baseurl']
      label = Kramdown::Document.new(@text[1],{remove_span_html_tags:true}).to_html # render markdown in caption
      label = converter.convert(label).gsub(/<\/?p[^>]*>/, "").chomp # remove <p> tags from render output

      "<figure id='#{@text[0]}_parent'><figcaption>#{label}</figcaption><div id='#{@text[0]}'></div></figure>"
    end
  end
end

Liquid::Template.register_tag('maincolumnJs', Jekyll::RenderMainColumnJsTag)
