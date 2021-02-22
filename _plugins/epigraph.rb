## Liquid tag 'epigraph' used to add an epigraph
## in the main text area of the layout
## Usage {% epigraph 'text-body-of-epigraph' 'author-of-epigraph' 'citation-of-epigraph' %}
#
module Jekyll
  class RenderEpigraphTag < Liquid::Tag

  	require "shellwords"

    def initialize(tag_name, text, tokens)
      super
      @text = text.shellsplit
    end

    def render(context)
        "<div class='epigraph'><blockquote><p>#{@text[0]}</p>"+
        "<footer>#{@text[1]}, "+"<cite>#{@text[2]}</cite></footer></blockquote></div>"
    end
  end
end

Liquid::Template.register_tag('epigraph', Jekyll::RenderEpigraphTag)


## Liquid tag 'epigraphInMessage' used to add an epigraph
## in the main text area of the layout
## Usage {% epigraph 'text-body-of-epigraph' 'author-of-epigraph' 'citation-of-epigraph' %}
#
module Jekyll
  class RenderEpigraphInMessageTag < Liquid::Tag

    require "shellwords"

    def initialize(tag_name, text, tokens)
      super
      @text = text.shellsplit
    end

    def render(context)
        "<div class='epigraph'><blockquote class='message'><cite>#{@text[0]}</cite>"+
        "<footer>#{@text[1]}, "+"<cite>#{@text[2]}</cite></footer></blockquote></div>"
    end
  end
end

Liquid::Template.register_tag('epigraphInMessage', Jekyll::RenderEpigraphInMessageTag)
