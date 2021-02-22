# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "fullmethanevachette"
  spec.version       = "4.2.0"
  spec.authors       = ["Bastien Le Bihan"]
  spec.email         = ["lebihan.bastien@gmail.com"]

  spec.summary       = %q{Full Methane Vachette.}
  spec.homepage      = "https://github.com/lebihanbastien/fullmethanevachette"
  spec.license       = "MIT"

  spec.metadata["plugin_type"] = "theme"

  spec.files         = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r{^(assets|_(includes|layouts|sass)/|(LICENSE|README)((\.(txt|md|markdown)|$)))}i)
  end

  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }

  spec.add_runtime_dependency "jekyll", ">= 3.6", "< 5.0"
  spec.add_runtime_dependency "jekyll-gist", "~> 1.4"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.6"
  spec.add_development_dependency "bundler", "~> 2.1", ">= 2.1.4"
  spec.add_development_dependency "wdm", "~> 0.1" if Gem.win_platform?
end
