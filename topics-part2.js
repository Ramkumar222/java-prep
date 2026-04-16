// ====== CATEGORIES 7-14: Generics, Multithreading, Java 8+, JVM, Design Patterns ======

const cats2 = [];

// CAT 7: GENERICS
cats2.push({ id:'cat-7', emoji:'🔣', title:'Generics', level:'intermediate', topics: [
  { title:'Why Generics? Type Safety & Type Erasure', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`<h4>Without Generics (Pre-Java 5)</h4>
${codeBlock('Java',`<span class="type">List</span> list = <span class="kw">new</span> <span class="type">ArrayList</span>();
list.<span class="fn">add</span>(<span class="str">"Hello"</span>);
list.<span class="fn">add</span>(<span class="num">123</span>);           <span class="cmt">// No compile error!</span>
<span class="type">String</span> s = (<span class="type">String</span>) list.<span class="fn">get</span>(<span class="num">1</span>); <span class="cmt">// 💥 ClassCastException at RUNTIME</span>`)}
<h4>With Generics</h4>
${codeBlock('Java',`<span class="type">List</span>&lt;<span class="type">String</span>&gt; list = <span class="kw">new</span> <span class="type">ArrayList</span>&lt;&gt;();
list.<span class="fn">add</span>(<span class="str">"Hello"</span>);
list.<span class="fn">add</span>(<span class="num">123</span>);           <span class="cmt">// ❌ Compile error! Type safety</span>
<span class="type">String</span> s = list.<span class="fn">get</span>(<span class="num">0</span>);  <span class="cmt">// No casting needed</span>`)}
<h4>Type Erasure</h4>
<p>Generics are a <strong>compile-time feature only</strong>. At runtime, all generic type information is <strong>erased</strong>. <code>List&lt;String&gt;</code> becomes just <code>List</code> in bytecode.</p>` },
  { title:'Wildcards — PECS Principle', tags:[{type:'important',label:'Important'}],
    body:`<p><strong>PECS</strong> = <strong>P</strong>roducer <strong>E</strong>xtends, <strong>C</strong>onsumer <strong>S</strong>uper</p>
${codeBlock('Java',`<span class="cmt">// ? extends T — PRODUCER (read-only)</span>
<span class="kw">void</span> <span class="fn">printAll</span>(<span class="type">List</span>&lt;? <span class="kw">extends</span> <span class="type">Number</span>&gt; list) {
    <span class="kw">for</span> (<span class="type">Number</span> n : list) <span class="type">System</span>.out.<span class="fn">println</span>(n); <span class="cmt">// ✅ read</span>
    <span class="cmt">// list.add(1);  ❌ Cannot add — unknown subtype</span>
}

<span class="cmt">// ? super T — CONSUMER (write)</span>
<span class="kw">void</span> <span class="fn">addNumbers</span>(<span class="type">List</span>&lt;? <span class="kw">super</span> <span class="type">Integer</span>&gt; list) {
    list.<span class="fn">add</span>(<span class="num">1</span>);   <span class="cmt">// ✅ can add Integer</span>
    list.<span class="fn">add</span>(<span class="num">2</span>);
}

<span class="fn">printAll</span>(<span class="type">List</span>.<span class="fn">of</span>(<span class="num">1</span>, <span class="num">2.5</span>, <span class="num">3L</span>));  <span class="cmt">// works with List&lt;Number&gt;, List&lt;Integer&gt;, etc.</span>`)}` }
]});

// CAT 8: MULTITHREADING
cats2.push({ id:'cat-8', emoji:'🧵', title:'Multithreading & Concurrency', level:'advanced', topics: [
  { title:'Creating Threads — Thread vs Runnable vs Callable', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`${codeBlock('Java',`<span class="cmt">// Way 1: Extend Thread</span>
<span class="kw">class</span> <span class="type">MyThread</span> <span class="kw">extends</span> <span class="type">Thread</span> {
    <span class="kw">public void</span> <span class="fn">run</span>() { <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"Thread running"</span>); }
}
<span class="kw">new</span> <span class="type">MyThread</span>().<span class="fn">start</span>();

<span class="cmt">// Way 2: Implement Runnable (preferred — allows extends)</span>
<span class="type">Runnable</span> task = () -> <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"Runnable running"</span>);
<span class="kw">new</span> <span class="type">Thread</span>(task).<span class="fn">start</span>();

<span class="cmt">// Way 3: Callable + Future (returns value)</span>
<span class="type">ExecutorService</span> exec = <span class="type">Executors</span>.<span class="fn">newSingleThreadExecutor</span>();
<span class="type">Future</span>&lt;<span class="type">Integer</span>&gt; future = exec.<span class="fn">submit</span>(() -> {
    <span class="type">Thread</span>.<span class="fn">sleep</span>(<span class="num">1000</span>);
    <span class="kw">return</span> <span class="num">42</span>;
});
<span class="type">System</span>.out.<span class="fn">println</span>(future.<span class="fn">get</span>()); <span class="cmt">// 42 (blocks until done)</span>
exec.<span class="fn">shutdown</span>();`)}` },
  { title:'Synchronization & Locks', tags:[{type:'important',label:'Important'}],
    body:`<h4>synchronized keyword</h4>
${codeBlock('Java',`<span class="kw">class</span> <span class="type">Counter</span> {
    <span class="kw">private int</span> count = <span class="num">0</span>;

    <span class="cmt">// Method-level sync (locks 'this')</span>
    <span class="kw">public synchronized void</span> <span class="fn">increment</span>() { count++; }

    <span class="cmt">// Block-level sync (finer control)</span>
    <span class="kw">public void</span> <span class="fn">decrement</span>() {
        <span class="kw">synchronized</span>(<span class="kw">this</span>) { count--; }
    }

    <span class="cmt">// Static sync (locks Class object)</span>
    <span class="kw">public static synchronized void</span> <span class="fn">staticMethod</span>() { }
}`)}
<h4>ReentrantLock (Java 5+)</h4>
${codeBlock('Java',`<span class="type">ReentrantLock</span> lock = <span class="kw">new</span> <span class="type">ReentrantLock</span>();
lock.<span class="fn">lock</span>();
<span class="kw">try</span> {
    <span class="cmt">// critical section</span>
} <span class="kw">finally</span> {
    lock.<span class="fn">unlock</span>();  <span class="cmt">// ALWAYS unlock in finally</span>
}`)}
${info('','📌 synchronized vs ReentrantLock','ReentrantLock offers: tryLock(), timed lock, interruptible lock, fairness policy, multiple Conditions. Prefer it for complex sync scenarios.')}` },
  { title:'volatile Keyword', body:`<p><code>volatile</code> ensures <strong>visibility</strong> — changes by one thread are immediately visible to others. But it does NOT guarantee <strong>atomicity</strong>.</p>
${codeBlock('Java',`<span class="kw">class</span> <span class="type">SharedFlag</span> {
    <span class="kw">private volatile boolean</span> running = <span class="kw">true</span>;

    <span class="kw">public void</span> <span class="fn">stop</span>() { running = <span class="kw">false</span>; }   <span class="cmt">// visible to all threads</span>

    <span class="kw">public void</span> <span class="fn">run</span>() {
        <span class="kw">while</span> (running) { <span class="cmt">/* work */</span> }  <span class="cmt">// reads latest value</span>
    }
}`)}
${info('warning','⚠️ volatile is NOT enough for','<code>count++</code> (read-modify-write is NOT atomic). Use <code>AtomicInteger</code> or <code>synchronized</code> instead.')}` },
  { title:'CompletableFuture — Async Programming', body:`<p><code>CompletableFuture</code> provides a powerful, non-blocking way to write asynchronous, event-driven code. It supports chaining, combining, and robust exception handling.</p>
${codeBlock('Java',`<span class="type">CompletableFuture</span>.<span class="fn">supplyAsync</span>(() -> <span class="fn">fetchUser</span>(<span class="num">1</span>))
    .<span class="fn">thenApply</span>(user -> user.<span class="fn">getName</span>())           <span class="cmt">// transform</span>
    .<span class="fn">thenApply</span>(<span class="type">String</span>::toUpperCase)               <span class="cmt">// chain</span>
    .<span class="fn">thenAccept</span>(name -> <span class="type">System</span>.out.<span class="fn">println</span>(name)) <span class="cmt">// consume</span>
    .<span class="fn">exceptionally</span>(ex -> { ex.<span class="fn">printStackTrace</span>(); <span class="kw">return null</span>; });

<span class="cmt">// Combine two independent futures</span>
<span class="type">CompletableFuture</span>&lt;<span class="type">String</span>&gt; f1 = <span class="type">CompletableFuture</span>.<span class="fn">supplyAsync</span>(() -> <span class="str">"Hello"</span>);
<span class="type">CompletableFuture</span>&lt;<span class="type">String</span>&gt; f2 = <span class="type">CompletableFuture</span>.<span class="fn">supplyAsync</span>(() -> <span class="str">"World"</span>);
f1.<span class="fn">thenCombine</span>(f2, (a, b) -> a + <span class="str">" "</span> + b)
  .<span class="fn">thenAccept</span>(<span class="type">System</span>.out::println); <span class="cmt">// Hello World</span>`)}` },
  { title:'Deadlock — Detection & Prevention', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`<p>Deadlock occurs when two+ threads each hold a lock and wait for the other's lock.</p>
${codeBlock('Java',`<span class="cmt">// 💀 Deadlock Example</span>
<span class="type">Object</span> lockA = <span class="kw">new</span> <span class="type">Object</span>(), lockB = <span class="kw">new</span> <span class="type">Object</span>();

<span class="type">Thread</span> t1 = <span class="kw">new</span> <span class="type">Thread</span>(() -> {
    <span class="kw">synchronized</span>(lockA) {        <span class="cmt">// holds A</span>
        <span class="type">Thread</span>.<span class="fn">sleep</span>(<span class="num">100</span>);
        <span class="kw">synchronized</span>(lockB) { }  <span class="cmt">// waits for B → 💀</span>
    }
});
<span class="type">Thread</span> t2 = <span class="kw">new</span> <span class="type">Thread</span>(() -> {
    <span class="kw">synchronized</span>(lockB) {        <span class="cmt">// holds B</span>
        <span class="kw">synchronized</span>(lockA) { }  <span class="cmt">// waits for A → 💀</span>
    }
});

<span class="cmt">// ✅ Fix: Always lock in SAME ORDER</span>
<span class="cmt">// Both threads: lock A first, then B</span>`)}` }
]});

// CAT 9: JAVA 8+ FEATURES
cats2.push({ id:'cat-9', emoji:'⚡', title:'Java 8+ Features', level:'advanced', topics: [
  { title:'Lambda Expressions & Functional Interfaces', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`<p>Lambda = anonymous function. Syntax: <code>(params) -> expression</code></p>
${codeBlock('Java',`<span class="cmt">// Before Java 8</span>
<span class="type">Runnable</span> r = <span class="kw">new</span> <span class="type">Runnable</span>() {
    <span class="kw">public void</span> <span class="fn">run</span>() { <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"Hello"</span>); }
};

<span class="cmt">// With Lambda</span>
<span class="type">Runnable</span> r = () -> <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"Hello"</span>);

<span class="cmt">// Common Functional Interfaces</span>
<span class="type">Predicate</span>&lt;<span class="type">String</span>&gt;    isEmpty  = s -> s.<span class="fn">isEmpty</span>();
<span class="type">Function</span>&lt;<span class="type">String</span>,<span class="type">Integer</span>&gt; len = s -> s.<span class="fn">length</span>();
<span class="type">Consumer</span>&lt;<span class="type">String</span>&gt;    printer  = s -> <span class="type">System</span>.out.<span class="fn">println</span>(s);
<span class="type">Supplier</span>&lt;<span class="type">Double</span>&gt;    random   = () -> <span class="type">Math</span>.<span class="fn">random</span>();
<span class="type">BiFunction</span>&lt;<span class="type">Integer</span>,<span class="type">Integer</span>,<span class="type">Integer</span>&gt; add = (a,b) -> a+b;`)}` },
  { title:'Stream API — Complete Guide', tags:[{type:'frequently-asked',label:'FAQ'},{type:'important',label:'Important'}],
    body:`<p>A Stream is a pipeline for processing collections. It is <strong>lazy</strong>, <strong>not a data structure</strong>, and <strong>one-time use</strong>.</p>
${codeBlock('Java',`<span class="type">List</span>&lt;<span class="type">String</span>&gt; names = <span class="type">List</span>.<span class="fn">of</span>(<span class="str">"Alice"</span>,<span class="str">"Bob"</span>,<span class="str">"Charlie"</span>,<span class="str">"Anna"</span>,<span class="str">"Bob"</span>);

<span class="cmt">// Filter + Map + Collect</span>
<span class="type">List</span>&lt;<span class="type">String</span>&gt; result = names.<span class="fn">stream</span>()
    .<span class="fn">filter</span>(n -> n.<span class="fn">startsWith</span>(<span class="str">"A"</span>))     <span class="cmt">// [Alice, Anna]</span>
    .<span class="fn">map</span>(<span class="type">String</span>::toUpperCase)           <span class="cmt">// [ALICE, ANNA]</span>
    .<span class="fn">sorted</span>()                           <span class="cmt">// [ALICE, ANNA]</span>
    .<span class="fn">collect</span>(<span class="type">Collectors</span>.<span class="fn">toList</span>());

<span class="cmt">// Reduce</span>
<span class="kw">int</span> sum = <span class="type">List</span>.<span class="fn">of</span>(<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>).<span class="fn">stream</span>().<span class="fn">reduce</span>(<span class="num">0</span>, <span class="type">Integer</span>::sum); <span class="cmt">// 15</span>

<span class="cmt">// GroupBy</span>
<span class="type">Map</span>&lt;<span class="type">Character</span>,<span class="type">List</span>&lt;<span class="type">String</span>&gt;&gt; grouped = names.<span class="fn">stream</span>()
    .<span class="fn">collect</span>(<span class="type">Collectors</span>.<span class="fn">groupingBy</span>(n -> n.<span class="fn">charAt</span>(<span class="num">0</span>)));
<span class="cmt">// {A=[Alice, Anna], B=[Bob, Bob], C=[Charlie]}</span>

<span class="cmt">// FlatMap — flatten nested streams</span>
<span class="type">List</span>&lt;<span class="type">List</span>&lt;<span class="type">Integer</span>&gt;&gt; nested = <span class="type">List</span>.<span class="fn">of</span>(<span class="type">List</span>.<span class="fn">of</span>(<span class="num">1</span>,<span class="num">2</span>), <span class="type">List</span>.<span class="fn">of</span>(<span class="num">3</span>,<span class="num">4</span>));
<span class="type">List</span>&lt;<span class="type">Integer</span>&gt; flat = nested.<span class="fn">stream</span>()
    .<span class="fn">flatMap</span>(<span class="type">Collection</span>::stream).<span class="fn">toList</span>(); <span class="cmt">// [1, 2, 3, 4]</span>`)}` },
  { title:'Optional — Avoid NullPointerException', body:`<p><code>Optional</code> is a container object used to represent the presence or absence of a value. It promotes safer code by explicitly handling null cases and forcing developers to consider the 'empty' state.</p>
${codeBlock('Java',`<span class="cmt">// Creating Optional</span>
<span class="type">Optional</span>&lt;<span class="type">String</span>&gt; opt = <span class="type">Optional</span>.<span class="fn">of</span>(<span class="str">"Hello"</span>);
<span class="type">Optional</span>&lt;<span class="type">String</span>&gt; empty = <span class="type">Optional</span>.<span class="fn">empty</span>();
<span class="type">Optional</span>&lt;<span class="type">String</span>&gt; nullable = <span class="type">Optional</span>.<span class="fn">ofNullable</span>(getUserName());

<span class="cmt">// Safe usage</span>
<span class="type">String</span> name = nullable
    .<span class="fn">filter</span>(n -> n.<span class="fn">length</span>() > <span class="num">3</span>)
    .<span class="fn">map</span>(<span class="type">String</span>::toUpperCase)
    .<span class="fn">orElse</span>(<span class="str">"UNKNOWN"</span>);

<span class="cmt">// orElseGet — lazy (Supplier, better for expensive defaults)</span>
<span class="type">String</span> val = nullable.<span class="fn">orElseGet</span>(() -> <span class="fn">computeExpensiveDefault</span>());

<span class="cmt">// orElseThrow</span>
<span class="type">String</span> val2 = nullable.<span class="fn">orElseThrow</span>(() -> <span class="kw">new</span> <span class="type">RuntimeException</span>(<span class="str">"Not found"</span>));`)}
${info('danger','⚠️ Anti-patterns','Don\'t use Optional as: field type, method parameter, or in collections. It\'s designed for <strong>return types only</strong>.')}` }
]});

// CAT 10: JAVA 9-21
cats2.push({ id:'cat-10', emoji:'🆕', title:'Java 9–21+ Features', level:'advanced', topics: [
  { title:'Records (Java 16+)', tags:[{type:'important',label:'Important'}],
    body:`<p>A concise way to create immutable data classes. Auto-generates: constructor, getters, <code>equals()</code>, <code>hashCode()</code>, <code>toString()</code>.</p>
${codeBlock('Java',`<span class="cmt">// Before Records — verbose!</span>
<span class="kw">public class</span> <span class="type">Point</span> {
    <span class="kw">private final int</span> x, y;
    <span class="type">Point</span>(<span class="kw">int</span> x, <span class="kw">int</span> y) { <span class="kw">this</span>.x=x; <span class="kw">this</span>.y=y; }
    <span class="kw">int</span> <span class="fn">x</span>() { <span class="kw">return</span> x; }
    <span class="kw">int</span> <span class="fn">y</span>() { <span class="kw">return</span> y; }
    <span class="cmt">// + equals, hashCode, toString... 50+ lines!</span>
}

<span class="cmt">// With Records — ONE line!</span>
<span class="kw">public record</span> <span class="type">Point</span>(<span class="kw">int</span> x, <span class="kw">int</span> y) {}

<span class="type">Point</span> p = <span class="kw">new</span> <span class="type">Point</span>(<span class="num">3</span>, <span class="num">5</span>);
p.<span class="fn">x</span>();          <span class="cmt">// 3 (not getX()!)</span>
p.<span class="fn">toString</span>();   <span class="cmt">// Point[x=3, y=5]</span>`)}` },
  { title:'Sealed Classes (Java 17+)', body:`<p>Restrict which classes can extend/implement a type. Enables exhaustive pattern matching.</p>
${codeBlock('Java',`<span class="kw">public sealed interface</span> <span class="type">Shape</span> <span class="kw">permits</span> <span class="type">Circle</span>, <span class="type">Rectangle</span>, <span class="type">Triangle</span> {}

<span class="kw">public record</span> <span class="type">Circle</span>(<span class="kw">double</span> radius) <span class="kw">implements</span> <span class="type">Shape</span> {}
<span class="kw">public record</span> <span class="type">Rectangle</span>(<span class="kw">double</span> w, <span class="kw">double</span> h) <span class="kw">implements</span> <span class="type">Shape</span> {}
<span class="kw">public final class</span> <span class="type">Triangle</span> <span class="kw">implements</span> <span class="type">Shape</span> { }

<span class="cmt">// Pattern matching switch (Java 21)</span>
<span class="kw">double</span> <span class="fn">area</span>(<span class="type">Shape</span> s) {
    <span class="kw">return switch</span>(s) {
        <span class="kw">case</span> <span class="type">Circle</span>(var r)      -> Math.PI * r * r;
        <span class="kw">case</span> <span class="type">Rectangle</span>(var w, var h) -> w * h;
        <span class="kw">case</span> <span class="type">Triangle</span> t       -> <span class="fn">calcTriArea</span>(t);
    }; <span class="cmt">// exhaustive — no default needed!</span>
}`)}` },
  { title:'Virtual Threads (Java 21)', body:`<p>Lightweight threads managed by JVM, not OS. Can run millions concurrently.</p>
${codeBlock('Java',`<span class="cmt">// Create virtual thread</span>
<span class="type">Thread</span> vt = <span class="type">Thread</span>.<span class="fn">ofVirtual</span>().<span class="fn">start</span>(() -> {
    <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"I'm a virtual thread!"</span>);
});

<span class="cmt">// ExecutorService with virtual threads</span>
<span class="kw">try</span> (<span class="kw">var</span> exec = <span class="type">Executors</span>.<span class="fn">newVirtualThreadPerTaskExecutor</span>()) {
    <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < <span class="num">1_000_000</span>; i++) {
        exec.<span class="fn">submit</span>(() -> {
            <span class="type">Thread</span>.<span class="fn">sleep</span>(<span class="type">Duration</span>.<span class="fn">ofSeconds</span>(<span class="num">1</span>));
            <span class="kw">return</span> <span class="num">42</span>;
        });
    }
} <span class="cmt">// 1 million concurrent tasks — no problem!</span>`)}
${info('tip','💡 When to use','Virtual threads are ideal for <strong>I/O-bound</strong> tasks (HTTP calls, DB queries). For CPU-bound work, stick with platform threads.')}` }
]});

// CAT 11: I/O
cats2.push({ id:'cat-11', emoji:'📁', title:'I/O & Serialization', level:'advanced', topics: [
  { title:'Serialization & transient keyword', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`<p>Serialization converts an object into a byte stream. <code>transient</code> fields are skipped.</p>
${codeBlock('Java',`<span class="kw">public class</span> <span class="type">User</span> <span class="kw">implements</span> <span class="type">Serializable</span> {
    <span class="kw">private static final long</span> serialVersionUID = <span class="num">1L</span>;
    <span class="type">String</span> name;
    <span class="kw">transient</span> <span class="type">String</span> password; <span class="cmt">// NOT serialized!</span>
}

<span class="cmt">// Serialize</span>
<span class="kw">try</span> (<span class="type">ObjectOutputStream</span> oos = <span class="kw">new</span> <span class="type">ObjectOutputStream</span>(<span class="kw">new</span> <span class="type">FileOutputStream</span>(<span class="str">"user.ser"</span>))) {
    oos.<span class="fn">writeObject</span>(user);
}

<span class="cmt">// Deserialize</span>
<span class="kw">try</span> (<span class="type">ObjectInputStream</span> ois = <span class="kw">new</span> <span class="type">ObjectInputStream</span>(<span class="kw">new</span> <span class="type">FileInputStream</span>(<span class="str">"user.ser"</span>))) {
    <span class="type">User</span> u = (<span class="type">User</span>) ois.<span class="fn">readObject</span>();
    <span class="cmt">// u.password == null (transient)</span>
}`)}
${info('warning','⚠️ serialVersionUID','Always declare it explicitly. If you don\'t, JVM auto-generates one — any class change breaks deserialization.')}` }
]});

// CAT 12: NETWORKING
cats2.push({ id:'cat-12', emoji:'🌐', title:'Networking in Java', level:'advanced', topics: [
  { title:'Socket Programming & HttpClient', body:`<p>Java supports both low-level socket programming for TCP/UDP and high-level HTTP abstractions. The modern <code>HttpClient</code> (Java 11+) provides a fluent API for synchronous and asynchronous requests.</p>
${codeBlock('Java',`<span class="cmt">// TCP Server</span>
<span class="type">ServerSocket</span> server = <span class="kw">new</span> <span class="type">ServerSocket</span>(<span class="num">8080</span>);
<span class="type">Socket</span> client = server.<span class="fn">accept</span>(); <span class="cmt">// blocks until connection</span>
<span class="type">BufferedReader</span> in = <span class="kw">new</span> <span class="type">BufferedReader</span>(<span class="kw">new</span> <span class="type">InputStreamReader</span>(client.<span class="fn">getInputStream</span>()));
<span class="type">System</span>.out.<span class="fn">println</span>(in.<span class="fn">readLine</span>());

<span class="cmt">// Java 11+ HttpClient</span>
<span class="type">HttpClient</span> httpClient = <span class="type">HttpClient</span>.<span class="fn">newHttpClient</span>();
<span class="type">HttpRequest</span> request = <span class="type">HttpRequest</span>.<span class="fn">newBuilder</span>()
    .<span class="fn">uri</span>(<span class="type">URI</span>.<span class="fn">create</span>(<span class="str">"https://api.example.com/data"</span>))
    .<span class="fn">GET</span>().<span class="fn">build</span>();
<span class="type">HttpResponse</span>&lt;<span class="type">String</span>&gt; response = httpClient.<span class="fn">send</span>(request, <span class="type">HttpResponse</span>.<span class="type">BodyHandlers</span>.<span class="fn">ofString</span>());
<span class="type">System</span>.out.<span class="fn">println</span>(response.<span class="fn">body</span>());`)}` }
]});

// CAT 13: JVM INTERNALS
cats2.push({ id:'cat-13', emoji:'🧠', title:'JVM Internals & Memory Management', level:'expert', topics: [
  { title:'JVM Memory Areas', tags:[{type:'frequently-asked',label:'FAQ'},{type:'important',label:'Important'}],
    body:`${diagram(`JVM Runtime Data Areas
┌────────────────────────────────────────────┐
│                HEAP (shared)               │
│  ┌──────────────┐  ┌───────────────────┐   │
│  │  Young Gen    │  │     Old Gen       │   │
│  │ ┌────┬───┬───┐│  │   (Tenured)       │   │
│  │ │Eden│ S0│ S1││  │                   │   │
│  │ └────┴───┴───┘│  │                   │   │
│  └──────────────┘  └───────────────────┘   │
├────────────────────────────────────────────┤
│  METASPACE (class metadata) — off-heap     │
├────────────────────────────────────────────┤
│  Per-Thread:                               │
│  ┌──────┐ ┌──────┐ ┌────────────────────┐  │
│  │Stack │ │ PC   │ │ Native Method Stack│  │
│  │Frames│ │ Reg  │ │                    │  │
│  └──────┘ └──────┘ └────────────────────┘  │
└────────────────────────────────────────────┘`)}
<ul>
<li><strong>Heap</strong> — Objects & arrays. Shared across threads. GC managed.</li>
<li><strong>Stack</strong> — Per thread. Method frames (local vars, operand stack). LIFO.</li>
<li><strong>Metaspace</strong> — Class metadata (replaced PermGen in Java 8).</li>
<li><strong>PC Register</strong> — Per thread. Address of current executing instruction.</li>
</ul>` },
  { title:'Garbage Collection Algorithms', tags:[{type:'important',label:'Important'}],
    body:`${table(['GC','Type','Best For','Pause'],
[['Serial','Single-thread stop-the-world','Small apps, clients','High'],
['Parallel (Throughput)','Multi-thread STW','Batch processing','Medium'],
['G1 (default Java 9+)','Region-based, concurrent','General purpose','Low-Medium'],
['ZGC','Concurrent, colored pointers','Large heaps (TB)','<strong>&lt;1ms</strong>'],
['Shenandoah','Concurrent compaction','Low latency','<strong>&lt;1ms</strong>']])}
<p><strong>G1 GC Internal:</strong> Divides heap into equal-sized <strong>regions</strong> (~2048). Prioritizes collecting regions with most garbage first ("Garbage First"). Supports concurrent marking.</p>` }
]});

// CAT 14: DESIGN PATTERNS
cats2.push({ id:'cat-14', emoji:'🏗️', title:'Design Patterns', level:'expert', topics: [
  { title:'Singleton Pattern — 6 Implementations', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`
${codeBlock('Java',`<span class="cmt">// 1. Eager Initialization</span>
<span class="kw">public class</span> <span class="type">Singleton</span> {
    <span class="kw">private static final</span> <span class="type">Singleton</span> INSTANCE = <span class="kw">new</span> <span class="type">Singleton</span>();
    <span class="kw">private</span> <span class="type">Singleton</span>() {}
    <span class="kw">public static</span> <span class="type">Singleton</span> <span class="fn">getInstance</span>() { <span class="kw">return</span> INSTANCE; }
}

<span class="cmt">// 2. Bill Pugh (Best — lazy + thread-safe + no sync overhead)</span>
<span class="kw">public class</span> <span class="type">Singleton</span> {
    <span class="kw">private</span> <span class="type">Singleton</span>() {}
    <span class="kw">private static class</span> <span class="type">Holder</span> {
        <span class="kw">static final</span> <span class="type">Singleton</span> INSTANCE = <span class="kw">new</span> <span class="type">Singleton</span>();
    }
    <span class="kw">public static</span> <span class="type">Singleton</span> <span class="fn">getInstance</span>() { <span class="kw">return</span> <span class="type">Holder</span>.INSTANCE; }
}

<span class="cmt">// 3. Enum Singleton (safest — prevents reflection & serialization attacks)</span>
<span class="kw">public enum</span> <span class="type">Singleton</span> {
    INSTANCE;
    <span class="kw">public void</span> <span class="fn">doWork</span>() { <span class="cmt">/* ... */</span> }
}`)}
${info('tip','💡 Best Choice','<strong>Bill Pugh</strong> for most cases. <strong>Enum</strong> if you need protection against reflection/serialization attacks.')}` },
  { title:'Factory & Builder Patterns', body:`<p>The <strong>Factory Pattern</strong> centralizes object creation based on types, while the <strong>Builder Pattern</strong> provides a step-by-step approach to construct complex mutable objects with numerous configuration options.</p>
${codeBlock('Java',`<span class="cmt">// FACTORY METHOD</span>
<span class="kw">interface</span> <span class="type">Shape</span> { <span class="kw">void</span> <span class="fn">draw</span>(); }
<span class="kw">class</span> <span class="type">Circle</span> <span class="kw">implements</span> <span class="type">Shape</span> { <span class="kw">public void</span> <span class="fn">draw</span>() { <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"○"</span>); } }
<span class="kw">class</span> <span class="type">Square</span> <span class="kw">implements</span> <span class="type">Shape</span> { <span class="kw">public void</span> <span class="fn">draw</span>() { <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"□"</span>); } }

<span class="kw">class</span> <span class="type">ShapeFactory</span> {
    <span class="kw">static</span> <span class="type">Shape</span> <span class="fn">create</span>(<span class="type">String</span> type) {
        <span class="kw">return switch</span>(type) {
            <span class="kw">case</span> <span class="str">"circle"</span> -> <span class="kw">new</span> <span class="type">Circle</span>();
            <span class="kw">case</span> <span class="str">"square"</span> -> <span class="kw">new</span> <span class="type">Square</span>();
            <span class="kw">default</span> -> <span class="kw">throw new</span> <span class="type">IllegalArgumentException</span>(<span class="str">"Unknown"</span>);
        };
    }
}

<span class="cmt">// BUILDER PATTERN</span>
<span class="kw">public class</span> <span class="type">Pizza</span> {
    <span class="kw">final</span> <span class="type">String</span> size, crust;
    <span class="kw">final boolean</span> cheese, pepperoni;

    <span class="kw">private</span> <span class="type">Pizza</span>(<span class="type">Builder</span> b) {
        size=b.size; crust=b.crust; cheese=b.cheese; pepperoni=b.pepperoni;
    }

    <span class="kw">static class</span> <span class="type">Builder</span> {
        <span class="type">String</span> size, crust;
        <span class="kw">boolean</span> cheese, pepperoni;
        <span class="type">Builder</span> <span class="fn">size</span>(<span class="type">String</span> s) { size=s; <span class="kw">return this</span>; }
        <span class="type">Builder</span> <span class="fn">crust</span>(<span class="type">String</span> c) { crust=c; <span class="kw">return this</span>; }
        <span class="type">Builder</span> <span class="fn">cheese</span>() { cheese=<span class="kw">true</span>; <span class="kw">return this</span>; }
        <span class="type">Builder</span> <span class="fn">pepperoni</span>() { pepperoni=<span class="kw">true</span>; <span class="kw">return this</span>; }
        <span class="type">Pizza</span> <span class="fn">build</span>() { <span class="kw">return new</span> <span class="type">Pizza</span>(<span class="kw">this</span>); }
    }
}
<span class="type">Pizza</span> p = <span class="kw">new</span> <span class="type">Pizza</span>.<span class="type">Builder</span>().<span class="fn">size</span>(<span class="str">"Large"</span>).<span class="fn">crust</span>(<span class="str">"Thin"</span>).<span class="fn">cheese</span>().<span class="fn">build</span>();`)}` }
]});

document.getElementById('dynamic-content').insertAdjacentHTML('beforeend', cats2.map(renderCategory).join(''));
