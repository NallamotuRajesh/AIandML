// inject_ui.js
// Adds a consistent header and footer and wraps page content in .container
document.addEventListener('DOMContentLoaded', function(){
  try{
    // Create nav only if not present
    if(!document.querySelector('.site-nav')){
      const nav = document.createElement('header');
      nav.className = 'site-nav';
      nav.innerHTML = `
        <div class="site-brand">🚀 AIandML Academy</div>
        <nav class="site-links">
          <a href="/index.html">Home</a>
          <a href="/Phase1_PythonForAI/course/index.html">Phase 1</a>
          <a href="/Phase2_CoreML/course/index.html">Phase 2</a>
          <a href="/Phase3_DeepLearning/course/index.html">Phase 3</a>
          <a href="/Phase4_NLP_LLMs/course/index.html">Phase 4</a>
          <a href="/Phase5_Deployment/course/index.html">Deployment</a>
        </nav>`;
      document.body.insertBefore(nav, document.body.firstChild);
    }

    // Wrap main content
    if(!document.querySelector('.container')){
      const wrapper = document.createElement('main');
      wrapper.className = 'container';
      // Move all body children except nav into wrapper
      const nav = document.querySelector('.site-nav');
      while(nav && nav.nextSibling){
        wrapper.appendChild(nav.nextSibling);
      }
      document.body.appendChild(wrapper);
    }

    // Add footer
    if(!document.querySelector('.site-footer')){
      const footer = document.createElement('footer');
      footer.className = 'site-footer';
      footer.innerHTML = `
        <div>© ${new Date().getFullYear()} AIandML Academy — Built for learning</div>
        <div style="margin-top:6px;font-size:0.85em;">Generated with <code>scripts/generate_dashboard.py</code></div>`;
      document.body.appendChild(footer);
    }
  }catch(e){
    console.error('inject_ui error', e);
  }
});
