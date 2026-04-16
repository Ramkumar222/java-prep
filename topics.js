// ========================================
// Dynamic Topic Renderer + Data (Cat 3-31)
// ========================================

function renderCategory(cat) {
  let html = `<section class="category-section" id="${cat.id}">
  <div class="category-header">
    <div class="category-emoji">${cat.emoji}</div>
    <div class="category-info"><h2 class="category-title">${cat.title}</h2><div class="category-count">${cat.topics.length} topics</div></div>
    <span class="category-level level-${cat.level}">${cat.level}</span>
  </div>`;
  cat.topics.forEach((t, i) => {
    const num = String(i + 1).padStart(2, '0');
    const tags = (t.tags || []).map(tg => `<span class="topic-tag tag-${tg.type}">${tg.label}</span>`).join('');
    html += `<div class="topic-card"><div class="topic-header"><span class="topic-number">${num}</span><span class="topic-title">${t.title}</span>${tags}<span class="topic-toggle">▼</span></div><div class="topic-body"><div class="topic-content">${t.body}</div></div></div>`;
  });
  html += `</section>`;
  return html;
}

function codeBlock(lang, code) {
  return `<div class="code-block"><div class="code-header"><div class="code-dots"><div class="code-dot"></div><div class="code-dot"></div><div class="code-dot"></div></div><span class="code-lang">${lang}</span><button class="code-copy">Copy</button></div><pre>${code}</pre></div>`;
}
function info(type, title, text) {
  return `<div class="info-box ${type}"><div class="info-box-title">${title}</div><p>${text}</p></div>`;
}
function table(headers, rows) {
  let h = `<table class="comparison-table"><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr>`;
  rows.forEach(r => { h += `<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`; });
  return h + '</table>';
}
function diagram(text) {
  return `<div class="diagram-box">${text}</div>`;
}

const allCategories = [];

// ====== CATEGORY 3: STRING HANDLING ======
allCategories.push({
  id:'cat-3', emoji:'🔤', title:'String Handling', level:'intermediate',
  topics: [
    { title:'String Immutability & String Pool', tags:[{type:'frequently-asked',label:'FAQ'}],
      body:`<h4>Why is String Immutable?</h4>
<ul><li><strong>Security</strong> — Strings used in class loading, network connections, DB URLs</li>
<li><strong>Thread Safety</strong> — Immutable objects are inherently thread-safe</li>
<li><strong>Caching</strong> — hashCode can be cached (used in HashMap keys)</li>
<li><strong>String Pool</strong> — Multiple references can share the same object safely</li></ul>
<h4>String Pool (String Constant Pool)</h4>
<p>A special memory area in the <strong>Heap</strong> (moved from PermGen in Java 7+) that stores unique string literals to save memory.</p>
${diagram(`Heap Memory
┌─────────────────────────────────┐
│  ┌──────────────────────┐       │
│  │   String Pool        │       │
│  │  ┌──────┐ ┌──────┐   │       │
│  │  │"Java"│ │"Hello"│  │       │
│  │  └──┬───┘ └───┬──┘   │       │
│  └─────┼─────────┼──────┘       │
│        │         │              │
│  s1 ───┘   s2 ───┘              │
│                                 │
│  ┌──────────┐  ← new String()  │
│  │ "Java"   │  (separate obj)  │
│  └──────────┘                   │
│  s3 ─────────┘                  │
└─────────────────────────────────┘`)}
${codeBlock('Java',`<span class="type">String</span> s1 = <span class="str">"Java"</span>;         <span class="cmt">// → Pool</span>
<span class="type">String</span> s2 = <span class="str">"Java"</span>;         <span class="cmt">// → Same object in Pool</span>
<span class="type">String</span> s3 = <span class="kw">new</span> <span class="type">String</span>(<span class="str">"Java"</span>); <span class="cmt">// → New object on Heap</span>

<span class="type">System</span>.out.<span class="fn">println</span>(s1 == s2);      <span class="cmt">// true  (same reference)</span>
<span class="type">System</span>.out.<span class="fn">println</span>(s1 == s3);      <span class="cmt">// false (different objects)</span>
<span class="type">System</span>.out.<span class="fn">println</span>(s1.<span class="fn">equals</span>(s3)); <span class="cmt">// true  (same content)</span>`)}
${info('warning','⚠️ Interview Trap','<code>new String("Java")</code> creates <strong>2 objects</strong> — one in Pool (if not exists) + one on Heap. <code>"Java"</code> literal creates only 1 in Pool.')}`
    },
    { title:'String vs StringBuffer vs StringBuilder', tags:[{type:'frequently-asked',label:'FAQ'}],
      body:`${table(['Feature','String','StringBuffer','StringBuilder'],
[['Mutability','<strong>Immutable</strong>','Mutable','Mutable'],
['Thread Safe','Yes (immutable)','Yes (synchronized)','<strong>No</strong>'],
['Performance','Slowest (new obj each time)','Slower (sync overhead)','<strong>Fastest</strong>'],
['Storage','String Pool + Heap','Heap','Heap'],
['Since','JDK 1.0','JDK 1.0','JDK 1.5']])}
${codeBlock('Java',`<span class="cmt">// String — creates new object each concat</span>
<span class="type">String</span> s = <span class="str">"Hello"</span>;
s = s + <span class="str">" World"</span>;  <span class="cmt">// New object created! Old "Hello" is wasted</span>

<span class="cmt">// StringBuilder — mutates in place (use in single-thread)</span>
<span class="type">StringBuilder</span> sb = <span class="kw">new</span> <span class="type">StringBuilder</span>(<span class="str">"Hello"</span>);
sb.<span class="fn">append</span>(<span class="str">" World"</span>);  <span class="cmt">// Same object modified</span>

<span class="cmt">// StringBuffer — thread-safe version (use in multi-thread)</span>
<span class="type">StringBuffer</span> sbf = <span class="kw">new</span> <span class="type">StringBuffer</span>(<span class="str">"Hello"</span>);
sbf.<span class="fn">append</span>(<span class="str">" World"</span>); <span class="cmt">// synchronized internally</span>`)}
${info('tip','💡 Rule of Thumb','Use <code>String</code> for constants. Use <code>StringBuilder</code> in loops/single-thread. Use <code>StringBuffer</code> only when multiple threads modify the same buffer.')}`
    },
    { title:'String Important Methods', body:`<p>The <code>String</code> class provides numerous built-in methods for manipulation. Since strings are immutable, these methods always return a <strong>new String instance</strong> rather than modifying the original.</p>
${codeBlock('Java',`<span class="type">String</span> s = <span class="str">"  Hello, Java World!  "</span>;

s.<span class="fn">length</span>()              <span class="cmt">// 23</span>
s.<span class="fn">charAt</span>(<span class="num">8</span>)             <span class="cmt">// 'J'</span>
s.<span class="fn">substring</span>(<span class="num">8</span>, <span class="num">12</span>)      <span class="cmt">// "Java"</span>
s.<span class="fn">indexOf</span>(<span class="str">"Java"</span>)       <span class="cmt">// 8</span>
s.<span class="fn">contains</span>(<span class="str">"World"</span>)     <span class="cmt">// true</span>
s.<span class="fn">startsWith</span>(<span class="str">"  He"</span>)   <span class="cmt">// true</span>
s.<span class="fn">replace</span>(<span class="str">'o'</span>, <span class="str">'0'</span>)    <span class="cmt">// "  Hell0, Java W0rld!  "</span>
s.<span class="fn">toUpperCase</span>()         <span class="cmt">// "  HELLO, JAVA WORLD!  "</span>
s.<span class="fn">trim</span>()                <span class="cmt">// "Hello, Java World!"</span>
s.<span class="fn">strip</span>()               <span class="cmt">// "Hello, Java World!" (Java 11+, Unicode-aware)</span>
s.<span class="fn">split</span>(<span class="str">", "</span>)           <span class="cmt">// ["  Hello", "Java World!  "]</span>
s.<span class="fn">toCharArray</span>()         <span class="cmt">// char[]</span>
<span class="type">String</span>.<span class="fn">join</span>(<span class="str">"-"</span>, <span class="str">"a"</span>, <span class="str">"b"</span>) <span class="cmt">// "a-b"</span>
<span class="str">"Ha"</span>.<span class="fn">repeat</span>(<span class="num">3</span>)          <span class="cmt">// "HaHaHa" (Java 11+)</span>
<span class="str">"  "</span>.<span class="fn">isBlank</span>()           <span class="cmt">// true (Java 11+)</span>`)}` },
    { title:'== vs .equals() for Strings', tags:[{type:'tricky',label:'Tricky'}],
      body:`<p><code>==</code> compares <strong>references</strong> (memory addresses). <code>.equals()</code> compares <strong>content</strong>.</p>
${codeBlock('Java',`<span class="type">String</span> a = <span class="str">"test"</span>;
<span class="type">String</span> b = <span class="str">"test"</span>;
<span class="type">String</span> c = <span class="kw">new</span> <span class="type">String</span>(<span class="str">"test"</span>);

a == b          <span class="cmt">// true  — same Pool reference</span>
a == c          <span class="cmt">// false — different objects</span>
a.<span class="fn">equals</span>(c)    <span class="cmt">// true  — same content</span>
c.<span class="fn">intern</span>() == a <span class="cmt">// true  — intern() returns Pool reference</span>`)}` },
    { title:'Regular Expressions (Pattern & Matcher)', body:`<p>Regex provides a powerful way to search, match, and manipulate text. The <code>Pattern</code> class compiles the regex, and the <code>Matcher</code> class executes it against a string.</p>
${codeBlock('Java',`<span class="kw">import</span> java.util.regex.*;

<span class="type">String</span> text = <span class="str">"My email is user@example.com and admin@test.org"</span>;
<span class="type">Pattern</span> p = <span class="type">Pattern</span>.<span class="fn">compile</span>(<span class="str">"[\\\\w.]+@[\\\\w.]+\\\\.\\\\w+"</span>);
<span class="type">Matcher</span> m = p.<span class="fn">matcher</span>(text);

<span class="kw">while</span> (m.<span class="fn">find</span>()) {
    <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"Found: "</span> + m.<span class="fn">group</span>());
}
<span class="cmt">// Found: user@example.com</span>
<span class="cmt">// Found: admin@test.org</span>

<span class="cmt">// Quick validation</span>
<span class="kw">boolean</span> valid = <span class="str">"hello123"</span>.<span class="fn">matches</span>(<span class="str">"[a-z0-9]+"</span>); <span class="cmt">// true</span>`)}` }
  ]
});

// ====== CATEGORY 4: EXCEPTION HANDLING ======
allCategories.push({
  id:'cat-4', emoji:'⚠️', title:'Exception Handling', level:'intermediate',
  topics: [
    { title:'Exception Hierarchy', tags:[{type:'frequently-asked',label:'FAQ'}],
      body:`${diagram(`                    Object
                      │
                  Throwable
                 ╱         ╲
              Error      Exception
              │            ╱        ╲
    OutOfMemoryError  RuntimeException  IOException
    StackOverflowError    │               │
                   NullPointerException  FileNotFoundException
                   ArrayIndexOOB         SQLException
                   ClassCastException
                   ArithmeticException`)}
${table(['Type','Checked/Unchecked','Handling'],
[['<strong>Error</strong>','Unchecked','Cannot/should not handle (JVM issues)'],
['<strong>Checked Exception</strong>','Checked','Must handle (try-catch or throws)'],
['<strong>RuntimeException</strong>','Unchecked','Optional handling (programming bugs)']])}` },
    { title:'try-catch-finally & try-with-resources', tags:[{type:'frequently-asked',label:'FAQ'}],
      body:`
${codeBlock('Java',`<span class="cmt">// Traditional try-catch-finally</span>
<span class="kw">try</span> {
    <span class="kw">int</span> result = <span class="num">10</span> / <span class="num">0</span>;
} <span class="kw">catch</span> (<span class="type">ArithmeticException</span> e) {
    <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"Cannot divide by zero: "</span> + e.<span class="fn">getMessage</span>());
} <span class="kw">finally</span> {
    <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"Always executes"</span>);
}

<span class="cmt">// try-with-resources (Java 7+) — auto-closes resources</span>
<span class="kw">try</span> (<span class="type">BufferedReader</span> br = <span class="kw">new</span> <span class="type">BufferedReader</span>(<span class="kw">new</span> <span class="type">FileReader</span>(<span class="str">"file.txt"</span>))) {
    <span class="type">String</span> line = br.<span class="fn">readLine</span>();
} <span class="kw">catch</span> (<span class="type">IOException</span> e) {
    e.<span class="fn">printStackTrace</span>();
}
<span class="cmt">// br.close() called automatically!</span>`)}
${info('','📌 Key Point','<code>finally</code> won\'t execute if: <code>System.exit()</code> is called, JVM crashes, or thread is killed.')}` },
    { title:'throw vs throws', body:`
${table(['','throw','throws'],
[['Purpose','Actually throw an exception','Declare that method might throw'],
['Location','Inside method body','In method signature'],
['Count','One exception at a time','Multiple (comma-separated)'],
['Followed by','Exception instance','Exception class name(s)']])}
${codeBlock('Java',`<span class="cmt">// throws — declares</span>
<span class="kw">void</span> <span class="fn">readFile</span>(<span class="type">String</span> path) <span class="kw">throws</span> <span class="type">IOException</span>, <span class="type">FileNotFoundException</span> {
    <span class="kw">if</span> (path == <span class="kw">null</span>) {
        <span class="kw">throw new</span> <span class="type">IllegalArgumentException</span>(<span class="str">"Path cannot be null"</span>); <span class="cmt">// throw</span>
    }
    <span class="cmt">// file reading logic...</span>
}`)}` },
    { title:'Custom Exceptions', body:`<p>Custom exceptions allow you to create domain-specific error types. Best practice is to extend <code>Exception</code> for recoverable errors (Checked), or <code>RuntimeException</code> for programming errors (Unchecked).</p>
${codeBlock('Java',`<span class="cmt">// Custom checked exception</span>
<span class="kw">public class</span> <span class="type">InsufficientFundsException</span> <span class="kw">extends</span> <span class="type">Exception</span> {
    <span class="kw">private double</span> amount;
    <span class="kw">public</span> <span class="type">InsufficientFundsException</span>(<span class="kw">double</span> amount) {
        <span class="kw">super</span>(<span class="str">"Insufficient funds. Shortfall: $"</span> + amount);
        <span class="kw">this</span>.amount = amount;
    }
    <span class="kw">public double</span> <span class="fn">getAmount</span>() { <span class="kw">return</span> amount; }
}

<span class="cmt">// Usage</span>
<span class="kw">public void</span> <span class="fn">withdraw</span>(<span class="kw">double</span> amount) <span class="kw">throws</span> <span class="type">InsufficientFundsException</span> {
    <span class="kw">if</span> (amount > balance)
        <span class="kw">throw new</span> <span class="type">InsufficientFundsException</span>(amount - balance);
    balance -= amount;
}`)}` }
  ]
});

// ====== CATEGORY 5: WRAPPER CLASSES ======
allCategories.push({
  id:'cat-5', emoji:'📦', title:'Wrapper Classes & Autoboxing', level:'intermediate',
  topics: [
    { title:'Autoboxing, Unboxing & Integer Cache', tags:[{type:'tricky',label:'Tricky'}],
      body:`<p><strong>Autoboxing</strong>: Primitive → Wrapper automatically. <strong>Unboxing</strong>: Wrapper → Primitive.</p>
${codeBlock('Java',`<span class="cmt">// Autoboxing</span>
<span class="type">Integer</span> x = <span class="num">10</span>;          <span class="cmt">// int → Integer (auto)</span>
<span class="type">List</span>&lt;<span class="type">Integer</span>&gt; list = <span class="kw">new</span> <span class="type">ArrayList</span>&lt;&gt;();
list.<span class="fn">add</span>(<span class="num">5</span>);               <span class="cmt">// autoboxing</span>

<span class="cmt">// Unboxing</span>
<span class="kw">int</span> y = x;                <span class="cmt">// Integer → int (auto)</span>

<span class="cmt">// ⚠️ Integer Cache Trap (-128 to 127)</span>
<span class="type">Integer</span> a = <span class="num">127</span>;
<span class="type">Integer</span> b = <span class="num">127</span>;
<span class="type">System</span>.out.<span class="fn">println</span>(a == b);   <span class="cmt">// TRUE ← cached!</span>

<span class="type">Integer</span> c = <span class="num">128</span>;
<span class="type">Integer</span> d = <span class="num">128</span>;
<span class="type">System</span>.out.<span class="fn">println</span>(c == d);   <span class="cmt">// FALSE ← different objects!</span>
<span class="type">System</span>.out.<span class="fn">println</span>(c.<span class="fn">equals</span>(d)); <span class="cmt">// TRUE</span>`)}
${info('danger','⚠️ NullPointerException','Unboxing a <code>null</code> wrapper throws NPE: <code>Integer x = null; int y = x; // NPE!</code>')}` }
  ]
});

// ====== CATEGORY 6: COLLECTIONS ======
allCategories.push({
  id:'cat-6', emoji:'🗂️', title:'Java Collections Framework', level:'intermediate',
  topics: [
    { title:'Collection Hierarchy', tags:[{type:'frequently-asked',label:'FAQ'}],
      body:`${diagram(`                    Iterable
                       │
                   Collection
                  ╱    │     ╲
               List   Set    Queue
               │       │       │
          ArrayList  HashSet  PriorityQueue
          LinkedList LinkedHashSet ArrayDeque
          Vector     TreeSet
          Stack

                     Map (separate hierarchy)
                  ╱    │      ╲
           HashMap  TreeMap  Hashtable
           LinkedHashMap     ConcurrentHashMap`)}` },
    { title:'HashMap Internal Working', tags:[{type:'frequently-asked',label:'FAQ'},{type:'important',label:'Important'}],
      body:`<h4>How HashMap Works Internally</h4>
<p>HashMap uses an <strong>array of Node (bucket)</strong>. Each bucket is a linked list (or tree after 8 nodes in Java 8+).</p>
<h4>put() Operation</h4>
<ol>
<li>Calculate <code>hashCode()</code> of the key</li>
<li>Compute bucket index: <code>index = hash & (n-1)</code> where n = array length</li>
<li>If bucket is empty → insert new Node</li>
<li>If bucket has entries → check <code>equals()</code> on keys:
  <ul><li>If key exists → update value</li>
  <li>If key doesn't exist → append to list/tree (collision)</li></ul></li>
<li>If size > capacity × loadFactor (0.75) → <strong>resize</strong> (double the array)</li>
</ol>
${diagram(`HashMap (capacity=16, loadFactor=0.75)
┌────────────────────────────────────────┐
│ Index │ Bucket (LinkedList / Tree)      │
├───────┼────────────────────────────────┤
│   0   │ null                            │
│   1   │ [K1:V1] → [K9:V9] → null       │
│   2   │ null                            │
│   3   │ [K3:V3] → null                  │
│  ...  │ ...                             │
│  15   │ [K7:V7] → null                  │
└───────┴────────────────────────────────┘
When bucket has >8 nodes → converts to Red-Black Tree (Java 8+)
When tree has <6 nodes  → converts back to LinkedList`)}
${codeBlock('Java',`<span class="type">Map</span>&lt;<span class="type">String</span>, <span class="type">Integer</span>&gt; map = <span class="kw">new</span> <span class="type">HashMap</span>&lt;&gt;();
map.<span class="fn">put</span>(<span class="str">"Alice"</span>, <span class="num">90</span>);   <span class="cmt">// hash("Alice") → bucket index → store</span>
map.<span class="fn">put</span>(<span class="str">"Bob"</span>, <span class="num">85</span>);
map.<span class="fn">get</span>(<span class="str">"Alice"</span>);        <span class="cmt">// hash("Alice") → find bucket → equals() → return 90</span>

<span class="cmt">// Custom key MUST override hashCode() and equals()</span>
<span class="kw">public class</span> <span class="type">Employee</span> {
    <span class="kw">int</span> id; <span class="type">String</span> name;
    <span class="ann">@Override</span>
    <span class="kw">public int</span> <span class="fn">hashCode</span>() { <span class="kw">return</span> <span class="type">Objects</span>.<span class="fn">hash</span>(id, name); }
    <span class="ann">@Override</span>
    <span class="kw">public boolean</span> <span class="fn">equals</span>(<span class="type">Object</span> o) {
        <span class="kw">if</span> (<span class="kw">this</span> == o) <span class="kw">return true</span>;
        <span class="kw">if</span> (!(o <span class="kw">instanceof</span> <span class="type">Employee</span> e)) <span class="kw">return false</span>;
        <span class="kw">return</span> id == e.id && <span class="type">Objects</span>.<span class="fn">equals</span>(name, e.name);
    }
}`)}
${info('danger','⚠️ equals/hashCode Contract','If <code>a.equals(b)</code> is true, then <code>a.hashCode() == b.hashCode()</code> MUST be true. Violating this breaks HashMap!')}` },
    { title:'ArrayList vs LinkedList', tags:[{type:'frequently-asked',label:'FAQ'}],
      body:`${table(['Operation','ArrayList','LinkedList'],
[['Internal','Dynamic array','Doubly linked list'],
['get(index)','<strong>O(1)</strong> — direct index','O(n) — traverse'],
['add(end)','O(1) amortized','<strong>O(1)</strong>'],
['add(middle)','O(n) — shift elements','<strong>O(1)</strong> if at node'],
['remove(middle)','O(n) — shift','<strong>O(1)</strong> if at node'],
['Memory','Less (contiguous)','More (node + 2 pointers)'],
['Cache','Better (locality)','Worse (scattered)']])}
${info('tip','💡 Rule','Use <strong>ArrayList</strong> 95% of the time. LinkedList only if heavy insert/remove at beginning or implementing Queue/Deque.')}` },
    { title:'Comparable vs Comparator', body:`
${table(['','Comparable','Comparator'],
[['Package','java.lang','java.util'],
['Method','<code>compareTo(T o)</code>','<code>compare(T o1, T o2)</code>'],
['Modifies class','Yes (implements)','No (external)'],
['Count','One natural ordering','Multiple orderings'],
['Lambda','No','Yes']])}
${codeBlock('Java',`<span class="cmt">// Comparable — natural ordering</span>
<span class="kw">class</span> <span class="type">Student</span> <span class="kw">implements</span> <span class="type">Comparable</span>&lt;<span class="type">Student</span>&gt; {
    <span class="type">String</span> name; <span class="kw">int</span> age;
    <span class="kw">public int</span> <span class="fn">compareTo</span>(<span class="type">Student</span> o) { <span class="kw">return</span> <span class="kw">this</span>.age - o.age; }
}

<span class="cmt">// Comparator — custom ordering (Java 8 lambda)</span>
<span class="type">List</span>&lt;<span class="type">Student</span>&gt; students = <span class="fn">getStudents</span>();
students.<span class="fn">sort</span>(<span class="type">Comparator</span>.<span class="fn">comparing</span>(<span class="type">Student</span>::getName)
    .<span class="fn">thenComparingInt</span>(<span class="type">Student</span>::getAge)
    .<span class="fn">reversed</span>());`)}` },
    { title:'HashMap vs ConcurrentHashMap vs Hashtable', body:`
${table(['Feature','HashMap','Hashtable','ConcurrentHashMap'],
[['Thread-safe','❌ No','✅ Yes (whole map locked)','✅ Yes (segment/bucket lock)'],
['Null key','1 null key allowed','❌ No','❌ No'],
['Null values','Allowed','❌ No','❌ No'],
['Performance','Fastest (single-thread)','Slowest','Fast (concurrent)'],
['Iterator','Fail-fast','Fail-fast','<strong>Fail-safe</strong> (weakly consistent)'],
['Since','1.2','1.0 (legacy)','1.5']])}` },
    { title:'Fail-Fast vs Fail-Safe Iterators', body:`
${table(['','Fail-Fast','Fail-Safe'],
[['Throws','ConcurrentModificationException','No exception'],
['When','Collection modified during iteration','Works on a clone/snapshot'],
['Collections','ArrayList, HashMap, HashSet','CopyOnWriteArrayList, ConcurrentHashMap'],
['Performance','Faster','Slightly slower (copy)']])}
${codeBlock('Java',`<span class="cmt">// Fail-fast — throws ConcurrentModificationException</span>
<span class="type">List</span>&lt;<span class="type">String</span>&gt; list = <span class="kw">new</span> <span class="type">ArrayList</span>&lt;&gt;(<span class="type">List</span>.<span class="fn">of</span>(<span class="str">"a"</span>, <span class="str">"b"</span>, <span class="str">"c"</span>));
<span class="kw">for</span> (<span class="type">String</span> s : list) {
    list.<span class="fn">remove</span>(s);  <span class="cmt">// ❌ ConcurrentModificationException!</span>
}

<span class="cmt">// ✅ Safe removal with Iterator</span>
<span class="type">Iterator</span>&lt;<span class="type">String</span>&gt; it = list.<span class="fn">iterator</span>();
<span class="kw">while</span> (it.<span class="fn">hasNext</span>()) {
    <span class="kw">if</span> (it.<span class="fn">next</span>().<span class="fn">equals</span>(<span class="str">"b"</span>)) it.<span class="fn">remove</span>();  <span class="cmt">// safe</span>
}

<span class="cmt">// ✅ Fail-safe — no exception</span>
<span class="type">CopyOnWriteArrayList</span>&lt;<span class="type">String</span>&gt; cowList = <span class="kw">new</span> <span class="type">CopyOnWriteArrayList</span>&lt;&gt;(list);
<span class="kw">for</span> (<span class="type">String</span> s : cowList) {
    cowList.<span class="fn">remove</span>(s);  <span class="cmt">// ✅ Works (iterates over snapshot)</span>
}`)}` }
  ]
});

document.getElementById('dynamic-content').insertAdjacentHTML('beforeend', allCategories.map(renderCategory).join(''));
