// ====== CATEGORIES 15-31 ======
const cats3 = [];

// CAT 15: JDBC
cats3.push({ id:'cat-15', emoji:'🗄️', title:'JDBC (Java Database Connectivity)', level:'expert', topics: [
  { title:'JDBC Architecture & PreparedStatement', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`<h4>JDBC Steps</h4>
<ol><li>Load Driver</li><li>Get Connection</li><li>Create Statement</li><li>Execute Query</li><li>Process ResultSet</li><li>Close Resources</li></ol>
${codeBlock('Java',`<span class="cmt">// Modern JDBC with try-with-resources</span>
<span class="type">String</span> url = <span class="str">"jdbc:mysql://localhost:3306/mydb"</span>;
<span class="kw">try</span> (<span class="type">Connection</span> conn = <span class="type">DriverManager</span>.<span class="fn">getConnection</span>(url, <span class="str">"user"</span>, <span class="str">"pass"</span>);
     <span class="type">PreparedStatement</span> ps = conn.<span class="fn">prepareStatement</span>(
         <span class="str">"SELECT * FROM users WHERE age > ? AND city = ?"</span>)) {

    ps.<span class="fn">setInt</span>(<span class="num">1</span>, <span class="num">25</span>);
    ps.<span class="fn">setString</span>(<span class="num">2</span>, <span class="str">"Mumbai"</span>);  <span class="cmt">// SQL injection safe!</span>

    <span class="kw">try</span> (<span class="type">ResultSet</span> rs = ps.<span class="fn">executeQuery</span>()) {
        <span class="kw">while</span> (rs.<span class="fn">next</span>()) {
            <span class="type">System</span>.out.<span class="fn">println</span>(rs.<span class="fn">getString</span>(<span class="str">"name"</span>) + <span class="str">" - "</span> + rs.<span class="fn">getInt</span>(<span class="str">"age"</span>));
        }
    }
}`)}
${info('danger','⚠️ SQL Injection','<strong>Never</strong> use String concatenation: <code>"WHERE name=\'" + input + "\'"</code>. Always use <code>PreparedStatement</code> with <code>?</code> placeholders.')}` },
  { title:'Transaction Management', body:`<p>Transactions ensure database operations adhere to ACID properties. Using <code>setAutoCommit(false)</code> allows multiple queries to run as a single atomic unit, requiring an explicit <code>commit()</code> or <code>rollback()</code>.</p>
${codeBlock('Java',`<span class="type">Connection</span> conn = <span class="type">DriverManager</span>.<span class="fn">getConnection</span>(url, user, pass);
conn.<span class="fn">setAutoCommit</span>(<span class="kw">false</span>);  <span class="cmt">// start transaction</span>
<span class="kw">try</span> {
    <span class="type">PreparedStatement</span> ps1 = conn.<span class="fn">prepareStatement</span>(<span class="str">"UPDATE accounts SET bal=bal-500 WHERE id=1"</span>);
    <span class="type">PreparedStatement</span> ps2 = conn.<span class="fn">prepareStatement</span>(<span class="str">"UPDATE accounts SET bal=bal+500 WHERE id=2"</span>);
    ps1.<span class="fn">executeUpdate</span>();
    ps2.<span class="fn">executeUpdate</span>();
    conn.<span class="fn">commit</span>();      <span class="cmt">// ✅ both succeed</span>
} <span class="kw">catch</span> (<span class="type">SQLException</span> e) {
    conn.<span class="fn">rollback</span>();    <span class="cmt">// ❌ undo both</span>
}`)}` }
]});

// CAT 16: REFLECTION
cats3.push({ id:'cat-16', emoji:'🪞', title:'Reflection & Annotations', level:'expert', topics: [
  { title:'Reflection API & Custom Annotations', tags:[{type:'important',label:'Important'}],
    body:`<p>Reflection lets you inspect/modify classes, methods, fields at <strong>runtime</strong>. Used by Spring, Hibernate, JUnit.</p>
${codeBlock('Java',`<span class="cmt">// Get class info</span>
<span class="type">Class</span>&lt;?&gt; clazz = <span class="type">Class</span>.<span class="fn">forName</span>(<span class="str">"com.example.User"</span>);

<span class="cmt">// Create instance</span>
<span class="type">Object</span> obj = clazz.<span class="fn">getDeclaredConstructor</span>().<span class="fn">newInstance</span>();

<span class="cmt">// Access private field</span>
<span class="type">Field</span> field = clazz.<span class="fn">getDeclaredField</span>(<span class="str">"name"</span>);
field.<span class="fn">setAccessible</span>(<span class="kw">true</span>);  <span class="cmt">// bypass private!</span>
field.<span class="fn">set</span>(obj, <span class="str">"Alice"</span>);

<span class="cmt">// Invoke method</span>
<span class="type">Method</span> m = clazz.<span class="fn">getDeclaredMethod</span>(<span class="str">"greet"</span>, <span class="type">String</span>.<span class="kw">class</span>);
m.<span class="fn">invoke</span>(obj, <span class="str">"World"</span>);

<span class="cmt">// Custom Annotation</span>
<span class="ann">@Retention</span>(<span class="type">RetentionPolicy</span>.RUNTIME)
<span class="ann">@Target</span>(<span class="type">ElementType</span>.METHOD)
<span class="kw">public @interface</span> <span class="type">MyTest</span> {
    <span class="type">String</span> <span class="fn">value</span>() <span class="kw">default</span> <span class="str">""</span>;
    <span class="kw">int</span> <span class="fn">priority</span>() <span class="kw">default</span> <span class="num">0</span>;
}

<span class="cmt">// Read annotation at runtime</span>
<span class="kw">if</span> (m.<span class="fn">isAnnotationPresent</span>(<span class="type">MyTest</span>.<span class="kw">class</span>)) {
    <span class="type">MyTest</span> ann = m.<span class="fn">getAnnotation</span>(<span class="type">MyTest</span>.<span class="kw">class</span>);
    <span class="type">System</span>.out.<span class="fn">println</span>(ann.<span class="fn">value</span>());
}`)}` }
]});

// CAT 17: INNER CLASSES
cats3.push({ id:'cat-17', emoji:'🎯', title:'Inner Classes & Nested Types', level:'expert', topics: [
  { title:'Types of Inner Classes', body:`
${table(['Type','Where Declared','Access Outer','Static?','Use Case'],
[['Member Inner','Inside class','Yes (this)','No','Tightly coupled helper'],
['Static Nested','Inside class','Only static','Yes','Independent utility'],
['Local Inner','Inside method','Yes + effectively final locals','No','One-time use in method'],
['Anonymous','Inline expression','Yes + effectively final','No','Quick interface impl']])}
${codeBlock('Java',`<span class="kw">class</span> <span class="type">Outer</span> {
    <span class="kw">private</span> <span class="type">String</span> msg = <span class="str">"Hello"</span>;

    <span class="cmt">// Member Inner Class</span>
    <span class="kw">class</span> <span class="type">Inner</span> {
        <span class="kw">void</span> <span class="fn">show</span>() { <span class="type">System</span>.out.<span class="fn">println</span>(msg); } <span class="cmt">// accesses outer's private</span>
    }

    <span class="cmt">// Static Nested Class</span>
    <span class="kw">static class</span> <span class="type">Utility</span> {
        <span class="kw">static void</span> <span class="fn">help</span>() { <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"Utility"</span>); }
    }

    <span class="kw">void</span> <span class="fn">demo</span>() {
        <span class="cmt">// Anonymous Inner Class</span>
        <span class="type">Runnable</span> r = <span class="kw">new</span> <span class="type">Runnable</span>() {
            <span class="kw">public void</span> <span class="fn">run</span>() { <span class="type">System</span>.out.<span class="fn">println</span>(msg); }
        };
    }
}
<span class="cmt">// Usage:</span>
<span class="type">Outer</span>.<span class="type">Inner</span> inner = <span class="kw">new</span> <span class="type">Outer</span>().<span class="kw">new</span> <span class="type">Inner</span>();
<span class="type">Outer</span>.<span class="type">Utility</span>.<span class="fn">help</span>(); <span class="cmt">// static — no outer instance needed</span>`)}` }
]});

// CAT 18: ENUMS
cats3.push({ id:'cat-18', emoji:'🏷️', title:'Enums', level:'expert', topics: [
  { title:'Enums with Fields, Methods & Interfaces', body:`<p>Java <code>enum</code> is a special type of class that represents a group of constants. They can have constructors, fields, and behavior, making them significantly more powerful than basic C-like enums.</p>
${codeBlock('Java',`<span class="kw">public enum</span> <span class="type">Planet</span> {
    MERCURY(<span class="num">3.303e+23</span>, <span class="num">2.4397e6</span>),
    VENUS(<span class="num">4.869e+24</span>, <span class="num">6.0518e6</span>),
    EARTH(<span class="num">5.976e+24</span>, <span class="num">6.37814e6</span>);

    <span class="kw">private final double</span> mass, radius;

    <span class="type">Planet</span>(<span class="kw">double</span> mass, <span class="kw">double</span> radius) {
        <span class="kw">this</span>.mass = mass;
        <span class="kw">this</span>.radius = radius;
    }

    <span class="kw">double</span> <span class="fn">surfaceGravity</span>() {
        <span class="kw">return</span> <span class="num">6.67300E-11</span> * mass / (radius * radius);
    }
}

<span class="cmt">// Enum with abstract method</span>
<span class="kw">public enum</span> <span class="type">Operation</span> {
    ADD { <span class="kw">double</span> <span class="fn">apply</span>(<span class="kw">double</span> a, <span class="kw">double</span> b) { <span class="kw">return</span> a+b; }},
    SUB { <span class="kw">double</span> <span class="fn">apply</span>(<span class="kw">double</span> a, <span class="kw">double</span> b) { <span class="kw">return</span> a-b; }};

    <span class="kw">abstract double</span> <span class="fn">apply</span>(<span class="kw">double</span> a, <span class="kw">double</span> b);
}
<span class="type">Operation</span>.ADD.<span class="fn">apply</span>(<span class="num">5</span>, <span class="num">3</span>); <span class="cmt">// 8.0</span>`)}
${info('tip','💡 Enum Singleton','Enum is the <strong>best Singleton</strong> in Java — serialization-safe, reflection-safe, thread-safe, and just one line.')}` }
]});

// CAT 19: FUNCTIONAL PROGRAMMING
cats3.push({ id:'cat-19', emoji:'λ', title:'Functional Programming in Java', level:'expert', topics: [
  { title:'Function Composition & Higher-Order Functions', body:`<p>Functional programming emphasizes combining simple functions into complex workflows. Higher-order functions can accept other functions as parameters or return them as results.</p>
${codeBlock('Java',`<span class="cmt">// Function composition</span>
<span class="type">Function</span>&lt;<span class="type">Integer</span>,<span class="type">Integer</span>&gt; doubleIt = x -> x * <span class="num">2</span>;
<span class="type">Function</span>&lt;<span class="type">Integer</span>,<span class="type">Integer</span>&gt; addTen = x -> x + <span class="num">10</span>;

<span class="type">Function</span>&lt;<span class="type">Integer</span>,<span class="type">Integer</span>&gt; doubleThenAdd = doubleIt.<span class="fn">andThen</span>(addTen);  <span class="cmt">// x*2 + 10</span>
<span class="type">Function</span>&lt;<span class="type">Integer</span>,<span class="type">Integer</span>&gt; addThenDouble = doubleIt.<span class="fn">compose</span>(addTen);  <span class="cmt">// (x+10) * 2</span>

doubleThenAdd.<span class="fn">apply</span>(<span class="num">5</span>);  <span class="cmt">// 20</span>
addThenDouble.<span class="fn">apply</span>(<span class="num">5</span>);  <span class="cmt">// 30</span>

<span class="cmt">// Higher-order function</span>
<span class="kw">static</span> &lt;<span class="type">T</span>&gt; <span class="type">List</span>&lt;<span class="type">T</span>&gt; <span class="fn">filter</span>(<span class="type">List</span>&lt;<span class="type">T</span>&gt; list, <span class="type">Predicate</span>&lt;<span class="type">T</span>&gt; pred) {
    <span class="kw">return</span> list.<span class="fn">stream</span>().<span class="fn">filter</span>(pred).<span class="fn">toList</span>();
}
<span class="fn">filter</span>(<span class="type">List</span>.<span class="fn">of</span>(<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>), n -> n % <span class="num">2</span> == <span class="num">0</span>); <span class="cmt">// [2, 4]</span>`)}` }
]});

// CAT 20: TESTING
cats3.push({ id:'cat-20', emoji:'🧪', title:'Testing in Java', level:'expert', topics: [
  { title:'JUnit 5 & Mockito', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`<p>JUnit is the standard framework for unit testing, providing powerful assertions and parameterized tests. Mockito perfectly pairs with it to mock dependencies and verify interactions.</p>
${codeBlock('Java',`<span class="cmt">// JUnit 5 Test</span>
<span class="kw">class</span> <span class="type">CalculatorTest</span> {

    <span class="ann">@Test</span>
    <span class="ann">@DisplayName</span>(<span class="str">"1 + 1 should equal 2"</span>)
    <span class="kw">void</span> <span class="fn">testAdd</span>() {
        <span class="type">Calculator</span> calc = <span class="kw">new</span> <span class="type">Calculator</span>();
        <span class="fn">assertEquals</span>(<span class="num">2</span>, calc.<span class="fn">add</span>(<span class="num">1</span>, <span class="num">1</span>));
        <span class="fn">assertThrows</span>(<span class="type">ArithmeticException</span>.<span class="kw">class</span>, () -> calc.<span class="fn">divide</span>(<span class="num">1</span>, <span class="num">0</span>));
    }

    <span class="ann">@ParameterizedTest</span>
    <span class="ann">@CsvSource</span>({<span class="str">"1,1,2"</span>, <span class="str">"2,3,5"</span>, <span class="str">"-1,1,0"</span>})
    <span class="kw">void</span> <span class="fn">testAddParameterized</span>(<span class="kw">int</span> a, <span class="kw">int</span> b, <span class="kw">int</span> expected) {
        <span class="fn">assertEquals</span>(expected, <span class="kw">new</span> <span class="type">Calculator</span>().<span class="fn">add</span>(a, b));
    }
}

<span class="cmt">// Mockito</span>
<span class="ann">@ExtendWith</span>(<span class="type">MockitoExtension</span>.<span class="kw">class</span>)
<span class="kw">class</span> <span class="type">UserServiceTest</span> {
    <span class="ann">@Mock</span> <span class="type">UserRepository</span> repo;
    <span class="ann">@InjectMocks</span> <span class="type">UserService</span> service;

    <span class="ann">@Test</span>
    <span class="kw">void</span> <span class="fn">testFindUser</span>() {
        <span class="fn">when</span>(repo.<span class="fn">findById</span>(<span class="num">1</span>)).<span class="fn">thenReturn</span>(<span class="type">Optional</span>.<span class="fn">of</span>(<span class="kw">new</span> <span class="type">User</span>(<span class="str">"Alice"</span>)));
        <span class="type">User</span> u = service.<span class="fn">getUser</span>(<span class="num">1</span>);
        <span class="fn">assertEquals</span>(<span class="str">"Alice"</span>, u.<span class="fn">getName</span>());
        <span class="fn">verify</span>(repo, <span class="fn">times</span>(<span class="num">1</span>)).<span class="fn">findById</span>(<span class="num">1</span>);
    }
}`)}` }
]});

// CAT 21: BUILD TOOLS
cats3.push({ id:'cat-21', emoji:'🔨', title:'Build Tools & Dependency Management', level:'expert', topics: [
  { title:'Maven vs Gradle', body:`
${table(['Feature','Maven','Gradle'],
[['Config','XML (pom.xml)','Groovy/Kotlin DSL'],
['Speed','Slower','<strong>Faster</strong> (incremental + cache)'],
['Flexibility','Convention-over-config','Highly customizable'],
['Learning','Easier','Steeper curve'],
['Android','No','<strong>Default</strong>'],
['Enterprise','<strong>Most common</strong>','Growing'],
['Dependency','Central repo','Central + custom']])}
${codeBlock('Java',`<span class="cmt">&lt;!-- Maven pom.xml --&gt;</span>
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
    &lt;version&gt;3.2.0&lt;/version&gt;
&lt;/dependency&gt;

<span class="cmt">// Gradle build.gradle</span>
implementation <span class="str">'org.springframework.boot:spring-boot-starter-web:3.2.0'</span>`)}` }
]});

// CAT 22: LOGGING
cats3.push({ id:'cat-22', emoji:'📝', title:'Logging in Java', level:'expert', topics: [
  { title:'SLF4J + Log Levels + Best Practices', body:`<p>SLF4J acts as a logging facade, decoupling your application from the underlying implementation (like Logback or Log4j2). Proper log levels and parameterized messages ensure good performance.</p>
${codeBlock('Java',`<span class="kw">import</span> org.slf4j.<span class="type">Logger</span>;
<span class="kw">import</span> org.slf4j.<span class="type">LoggerFactory</span>;

<span class="kw">public class</span> <span class="type">OrderService</span> {
    <span class="kw">private static final</span> <span class="type">Logger</span> log = <span class="type">LoggerFactory</span>.<span class="fn">getLogger</span>(<span class="type">OrderService</span>.<span class="kw">class</span>);

    <span class="kw">public void</span> <span class="fn">placeOrder</span>(<span class="type">Order</span> order) {
        log.<span class="fn">debug</span>(<span class="str">"Processing order: {}"</span>, order.<span class="fn">getId</span>());   <span class="cmt">// parameterized!</span>
        log.<span class="fn">info</span>(<span class="str">"Order placed: {}"</span>, order.<span class="fn">getId</span>());
        log.<span class="fn">warn</span>(<span class="str">"Low inventory for item: {}"</span>, item);
        log.<span class="fn">error</span>(<span class="str">"Payment failed for order: {}"</span>, order.<span class="fn">getId</span>(), exception);
    }
}
<span class="cmt">// Levels: TRACE < DEBUG < INFO < WARN < ERROR < FATAL</span>
<span class="cmt">// ✅ Use {} placeholders — avoids String concatenation if level is disabled</span>
<span class="cmt">// ❌ log.debug("Order: " + order.toString()); // always evaluates toString!</span>`)}` }
]});

// CAT 23: SECURITY
cats3.push({ id:'cat-23', emoji:'🔒', title:'Security in Java', level:'expert', topics: [
  { title:'Cryptography & Secure Coding', body:`<p>Java's Security API offers robust features for protecting data. Use <code>MessageDigest</code> for irreversible hashing and <code>Cipher</code> for two-way symmetric or asymmetric encryption.</p>
${codeBlock('Java',`<span class="cmt">// Hashing (SHA-256)</span>
<span class="type">MessageDigest</span> md = <span class="type">MessageDigest</span>.<span class="fn">getInstance</span>(<span class="str">"SHA-256"</span>);
<span class="kw">byte</span>[] hash = md.<span class="fn">digest</span>(<span class="str">"password"</span>.<span class="fn">getBytes</span>(<span class="type">StandardCharsets</span>.UTF_8));

<span class="cmt">// AES Encryption</span>
<span class="type">KeyGenerator</span> kg = <span class="type">KeyGenerator</span>.<span class="fn">getInstance</span>(<span class="str">"AES"</span>);
kg.<span class="fn">init</span>(<span class="num">256</span>);
<span class="type">SecretKey</span> key = kg.<span class="fn">generateKey</span>();

<span class="type">Cipher</span> cipher = <span class="type">Cipher</span>.<span class="fn">getInstance</span>(<span class="str">"AES/GCM/NoPadding"</span>);
cipher.<span class="fn">init</span>(<span class="type">Cipher</span>.ENCRYPT_MODE, key);
<span class="kw">byte</span>[] encrypted = cipher.<span class="fn">doFinal</span>(data);

<span class="cmt">// ✅ Use char[] for passwords (can be zeroed out)</span>
<span class="kw">char</span>[] pwd = <span class="fn">getPassword</span>();
<span class="cmt">// ... use pwd ...</span>
<span class="type">Arrays</span>.<span class="fn">fill</span>(pwd, <span class="str">'\\0'</span>);  <span class="cmt">// wipe from memory</span>`)}` }
]});

// CAT 24: MEMORY & PERFORMANCE
cats3.push({ id:'cat-24', emoji:'⚙️', title:'Memory Model & Performance', level:'expert', topics: [
  { title:'happens-before & JMM', body:`<p>The <strong>Java Memory Model (JMM)</strong> defines rules for when writes by one thread are visible to reads by another.</p>
<h4>happens-before Rules</h4>
<ul>
<li><strong>Program Order</strong> — Each action in a thread happens-before the next action</li>
<li><strong>Monitor Lock</strong> — Unlock happens-before every subsequent lock of same monitor</li>
<li><strong>volatile</strong> — Write to volatile happens-before read of that volatile</li>
<li><strong>Thread Start</strong> — <code>start()</code> happens-before any action in the new thread</li>
<li><strong>Thread Join</strong> — All actions in a thread happen-before <code>join()</code> returns</li>
<li><strong>Transitivity</strong> — If A hb B and B hb C, then A hb C</li>
</ul>` }
]});

// CAT 25: MODULES
cats3.push({ id:'cat-25', emoji:'📦', title:'Java Modules (JPMS)', level:'expert', topics: [
  { title:'Module System Basics', body:`<p>The Java Platform Module System (JPMS), introduced in Java 9, allows grouping packages into modules. This enforces strong encapsulation and allows building compact runtime images.</p>
${codeBlock('Java',`<span class="cmt">// module-info.java</span>
<span class="kw">module</span> com.myapp.core {
    <span class="kw">requires</span> java.sql;                <span class="cmt">// dependency</span>
    <span class="kw">requires transitive</span> java.logging; <span class="cmt">// transitive dep</span>
    <span class="kw">exports</span> com.myapp.core.api;       <span class="cmt">// public API</span>
    <span class="kw">opens</span> com.myapp.core.model <span class="kw">to</span> com.fasterxml.jackson; <span class="cmt">// reflection access</span>
    <span class="kw">provides</span> <span class="type">PaymentService</span> <span class="kw">with</span> <span class="type">StripePayment</span>; <span class="cmt">// SPI</span>
}`)}
${info('','📌 Why Modules?','Strong encapsulation (hide internal packages), reliable configuration (fail at startup not runtime), smaller runtime images with <code>jlink</code>.')}` }
]});

// CAT 26: I18N
cats3.push({ id:'cat-26', emoji:'🌍', title:'Internationalization (i18n)', level:'expert', topics: [
  { title:'Locale & ResourceBundle', body:`<p>Internationalization helps adapt software to various languages and regions without code changes. <code>ResourceBundle</code> manages local-specific strings, while <code>NumberFormat</code> and <code>DateTimeFormatter</code> handle standards.</p>
${codeBlock('Java',`<span class="type">Locale</span> fr = <span class="type">Locale</span>.<span class="fn">of</span>(<span class="str">"fr"</span>, <span class="str">"FR"</span>);
<span class="type">ResourceBundle</span> bundle = <span class="type">ResourceBundle</span>.<span class="fn">getBundle</span>(<span class="str">"messages"</span>, fr);
<span class="type">String</span> greeting = bundle.<span class="fn">getString</span>(<span class="str">"hello"</span>); <span class="cmt">// "Bonjour"</span>

<span class="cmt">// Number formatting</span>
<span class="type">NumberFormat</span> nf = <span class="type">NumberFormat</span>.<span class="fn">getCurrencyInstance</span>(fr);
nf.<span class="fn">format</span>(<span class="num">1234.56</span>); <span class="cmt">// "1 234,56 €"</span>

<span class="cmt">// Date formatting (Java 8+)</span>
<span class="type">DateTimeFormatter</span> dtf = <span class="type">DateTimeFormatter</span>
    .<span class="fn">ofLocalizedDate</span>(<span class="type">FormatStyle</span>.FULL).<span class="fn">withLocale</span>(fr);
<span class="type">LocalDate</span>.<span class="fn">now</span>().<span class="fn">format</span>(dtf); <span class="cmt">// "mercredi 16 avril 2026"</span>`)}` }
]});

// CAT 27: JPA/HIBERNATE
cats3.push({ id:'cat-27', emoji:'💾', title:'JPA / Hibernate', level:'expert', topics: [
  { title:'JPA Entity, Relationships & N+1 Problem', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`
${codeBlock('Java',`<span class="ann">@Entity</span>
<span class="ann">@Table</span>(name = <span class="str">"users"</span>)
<span class="kw">public class</span> <span class="type">User</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>(strategy = <span class="type">GenerationType</span>.IDENTITY)
    <span class="kw">private</span> <span class="type">Long</span> id;

    <span class="ann">@Column</span>(nullable = <span class="kw">false</span>)
    <span class="kw">private</span> <span class="type">String</span> name;

    <span class="ann">@OneToMany</span>(mappedBy = <span class="str">"user"</span>, fetch = <span class="type">FetchType</span>.LAZY)
    <span class="kw">private</span> <span class="type">List</span>&lt;<span class="type">Order</span>&gt; orders;  <span class="cmt">// loaded on access</span>
}

<span class="ann">@Entity</span>
<span class="kw">public class</span> <span class="type">Order</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>
    <span class="kw">private</span> <span class="type">Long</span> id;

    <span class="ann">@ManyToOne</span>(fetch = <span class="type">FetchType</span>.LAZY)
    <span class="ann">@JoinColumn</span>(name = <span class="str">"user_id"</span>)
    <span class="kw">private</span> <span class="type">User</span> user;
}`)}
<h4>N+1 Problem</h4>
<p>Loading 100 users then accessing <code>user.getOrders()</code> fires <strong>1 query for users + 100 queries for orders = 101 queries!</strong></p>
<p><strong>Fix:</strong> Use <code>JOIN FETCH</code> in JPQL: <code>SELECT u FROM User u JOIN FETCH u.orders</code></p>` }
]});

// CAT 28: SPRING
cats3.push({ id:'cat-28', emoji:'🍃', title:'Spring Framework Essentials', level:'expert', topics: [
  { title:'IoC, DI & Spring Boot', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`<h4>Inversion of Control (IoC)</h4>
<p>The framework controls object creation and lifecycle, not the developer. <strong>Dependency Injection</strong> is how IoC is implemented.</p>
${codeBlock('Java',`<span class="cmt">// Define a service</span>
<span class="ann">@Service</span>
<span class="kw">public class</span> <span class="type">UserService</span> {
    <span class="kw">private final</span> <span class="type">UserRepository</span> repo;  <span class="cmt">// dependency</span>

    <span class="cmt">// Constructor injection (recommended)</span>
    <span class="kw">public</span> <span class="type">UserService</span>(<span class="type">UserRepository</span> repo) {
        <span class="kw">this</span>.repo = repo;  <span class="cmt">// Spring auto-injects</span>
    }

    <span class="kw">public</span> <span class="type">User</span> <span class="fn">findById</span>(<span class="type">Long</span> id) {
        <span class="kw">return</span> repo.<span class="fn">findById</span>(id).<span class="fn">orElseThrow</span>();
    }
}

<span class="cmt">// REST Controller</span>
<span class="ann">@RestController</span>
<span class="ann">@RequestMapping</span>(<span class="str">"/api/users"</span>)
<span class="kw">public class</span> <span class="type">UserController</span> {
    <span class="kw">private final</span> <span class="type">UserService</span> service;
    <span class="kw">public</span> <span class="type">UserController</span>(<span class="type">UserService</span> svc) { <span class="kw">this</span>.service = svc; }

    <span class="ann">@GetMapping</span>(<span class="str">"/{id}"</span>)
    <span class="kw">public</span> <span class="type">User</span> <span class="fn">getUser</span>(<span class="ann">@PathVariable</span> <span class="type">Long</span> id) {
        <span class="kw">return</span> service.<span class="fn">findById</span>(id);
    }

    <span class="ann">@PostMapping</span>
    <span class="ann">@ResponseStatus</span>(<span class="type">HttpStatus</span>.CREATED)
    <span class="kw">public</span> <span class="type">User</span> <span class="fn">createUser</span>(<span class="ann">@RequestBody</span> <span class="type">User</span> user) {
        <span class="kw">return</span> service.<span class="fn">save</span>(user);
    }
}`)}
${info('tip','💡 Bean Scopes','<strong>singleton</strong> (default — one instance), <strong>prototype</strong> (new each time), <strong>request</strong> (per HTTP request), <strong>session</strong> (per HTTP session).')}` }
]});

// CAT 29: MICROSERVICES
cats3.push({ id:'cat-29', emoji:'☁️', title:'Microservices Concepts', level:'expert', topics: [
  { title:'Microservices Architecture & Patterns', body:`
<h4>Monolith vs Microservices</h4>
${table(['','Monolithic','Microservices'],
[['Deployment','Single unit','Independent services'],
['Scaling','Scale entire app','Scale individual services'],
['Tech Stack','One stack','Polyglot'],
['Team','One large team','Small, autonomous teams'],
['Complexity','Simple (initially)','Complex (distributed sys)']])}
<h4>Key Patterns</h4>
<ul>
<li><strong>API Gateway</strong> — Single entry point (routing, auth, rate limiting)</li>
<li><strong>Service Discovery</strong> — Services find each other (Eureka, Consul)</li>
<li><strong>Circuit Breaker</strong> — Prevent cascading failures (Resilience4j)</li>
<li><strong>Saga Pattern</strong> — Distributed transactions via event choreography</li>
<li><strong>CQRS</strong> — Separate read/write models for performance</li>
<li><strong>Event Sourcing</strong> — Store events, not state</li>
</ul>` }
]});

// CAT 30: MISCELLANEOUS
cats3.push({ id:'cat-30', emoji:'🎲', title:'Miscellaneous & Tricky Topics', level:'expert', topics: [
  { title:'Pass by Value in Java — NOT Pass by Reference!', tags:[{type:'tricky',label:'Tricky'}],
    body:`<p>Java is <strong>always pass by value</strong>. For objects, the <strong>reference value</strong> (address) is copied — NOT the object itself.</p>
${codeBlock('Java',`<span class="kw">void</span> <span class="fn">changeRef</span>(<span class="type">StringBuilder</span> sb) {
    sb = <span class="kw">new</span> <span class="type">StringBuilder</span>(<span class="str">"New"</span>);  <span class="cmt">// local ref changed, original unaffected</span>
}
<span class="kw">void</span> <span class="fn">mutateObj</span>(<span class="type">StringBuilder</span> sb) {
    sb.<span class="fn">append</span>(<span class="str">" World"</span>);   <span class="cmt">// modifies the SAME object via copied reference</span>
}

<span class="type">StringBuilder</span> s = <span class="kw">new</span> <span class="type">StringBuilder</span>(<span class="str">"Hello"</span>);
<span class="fn">changeRef</span>(s);
<span class="type">System</span>.out.<span class="fn">println</span>(s); <span class="cmt">// "Hello" — unchanged!</span>
<span class="fn">mutateObj</span>(s);
<span class="type">System</span>.out.<span class="fn">println</span>(s); <span class="cmt">// "Hello World" — mutated via same ref</span>`)}` },
  { title:'Immutable Class — How to Create', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`<h4>Rules for Immutable Class</h4>
<ol><li>Declare class as <code>final</code></li><li>All fields <code>private final</code></li><li>No setters</li><li>Initialize via constructor</li><li>Deep copy mutable fields in constructor and getters</li></ol>
${codeBlock('Java',`<span class="kw">public final class</span> <span class="type">Employee</span> {
    <span class="kw">private final</span> <span class="type">String</span> name;
    <span class="kw">private final</span> <span class="type">List</span>&lt;<span class="type">String</span>&gt; skills;

    <span class="kw">public</span> <span class="type">Employee</span>(<span class="type">String</span> name, <span class="type">List</span>&lt;<span class="type">String</span>&gt; skills) {
        <span class="kw">this</span>.name = name;
        <span class="kw">this</span>.skills = <span class="kw">new</span> <span class="type">ArrayList</span>&lt;&gt;(skills); <span class="cmt">// defensive copy</span>
    }

    <span class="kw">public</span> <span class="type">String</span> <span class="fn">getName</span>() { <span class="kw">return</span> name; }
    <span class="kw">public</span> <span class="type">List</span>&lt;<span class="type">String</span>&gt; <span class="fn">getSkills</span>() {
        <span class="kw">return</span> <span class="type">Collections</span>.<span class="fn">unmodifiableList</span>(skills); <span class="cmt">// defensive return</span>
    }
}`)}` },
  { title:'final vs finally vs finalize()', tags:[{type:'frequently-asked',label:'FAQ'}],
    body:`${table(['Keyword','Type','Purpose'],
[['<code>final</code>','Modifier','Variable (constant), Method (can\'t override), Class (can\'t extend)'],
['<code>finally</code>','Block','Always executes after try-catch (cleanup code)'],
['<code>finalize()</code>','Method','Called by GC before object destruction (<strong>deprecated since Java 9</strong>)']])}` }
]});

// CAT 31: CODING PROBLEMS
cats3.push({ id:'cat-31', emoji:'💻', title:'Coding / Problem-Solving', level:'expert', topics: [
  { title:'Reverse a String', body:`<p>A classic interview question. It can be solved iteratively using a <code>StringBuilder</code>, manipulating a character array in-place for performance, or using functional Stream tricks.</p>
${codeBlock('Java',`<span class="cmt">// Method 1: StringBuilder</span>
<span class="type">String</span> reversed = <span class="kw">new</span> <span class="type">StringBuilder</span>(<span class="str">"Hello"</span>).<span class="fn">reverse</span>().<span class="fn">toString</span>();

<span class="cmt">// Method 2: char array</span>
<span class="kw">char</span>[] arr = <span class="str">"Hello"</span>.<span class="fn">toCharArray</span>();
<span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>, j = arr.length - <span class="num">1</span>; i < j; i++, j--) {
    <span class="kw">char</span> temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
}

<span class="cmt">// Method 3: Stream</span>
<span class="type">String</span> rev = <span class="str">"Hello"</span>.<span class="fn">chars</span>()
    .<span class="fn">mapToObj</span>(c -> <span class="type">String</span>.<span class="fn">valueOf</span>((<span class="kw">char</span>) c))
    .<span class="fn">reduce</span>(<span class="str">""</span>, (a, b) -> b + a);`)}` },
  { title:'Find Duplicates in Array using Streams', body:`<p>Stream API presents clean functional approaches to find repeated elements. You can filter based on <code>HashSet::add</code> failure, or count occurrences via <code>Collectors.groupingBy</code>.</p>
${codeBlock('Java',`<span class="type">List</span>&lt;<span class="type">Integer</span>&gt; nums = <span class="type">List</span>.<span class="fn">of</span>(<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">2</span>,<span class="num">4</span>,<span class="num">3</span>,<span class="num">5</span>);

<span class="cmt">// Find duplicates</span>
<span class="type">Set</span>&lt;<span class="type">Integer</span>&gt; seen = <span class="kw">new</span> <span class="type">HashSet</span>&lt;&gt;();
<span class="type">Set</span>&lt;<span class="type">Integer</span>&gt; duplicates = nums.<span class="fn">stream</span>()
    .<span class="fn">filter</span>(n -> !seen.<span class="fn">add</span>(n))  <span class="cmt">// add returns false if already exists</span>
    .<span class="fn">collect</span>(<span class="type">Collectors</span>.<span class="fn">toSet</span>()); <span class="cmt">// {2, 3}</span>

<span class="cmt">// Count occurrences</span>
<span class="type">Map</span>&lt;<span class="type">Integer</span>,<span class="type">Long</span>&gt; freq = nums.<span class="fn">stream</span>()
    .<span class="fn">collect</span>(<span class="type">Collectors</span>.<span class="fn">groupingBy</span>(n -> n, <span class="type">Collectors</span>.<span class="fn">counting</span>()));
<span class="cmt">// {1=1, 2=2, 3=2, 4=1, 5=1}</span>`)}` },
  { title:'Producer-Consumer using BlockingQueue', body:`<p>The standard pattern for decoupling active tasks. <code>BlockingQueue</code> eliminates the need for manual <code>wait()</code> and <code>notify()</code> blocks, inherently providing thread-safe blocking synchronization.</p>
${codeBlock('Java',`<span class="type">BlockingQueue</span>&lt;<span class="type">Integer</span>&gt; queue = <span class="kw">new</span> <span class="type">ArrayBlockingQueue</span>&lt;&gt;(<span class="num">10</span>);

<span class="cmt">// Producer</span>
<span class="type">Thread</span> producer = <span class="kw">new</span> <span class="type">Thread</span>(() -> {
    <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < <span class="num">20</span>; i++) {
        queue.<span class="fn">put</span>(i);  <span class="cmt">// blocks if queue full</span>
        <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"Produced: "</span> + i);
    }
});

<span class="cmt">// Consumer</span>
<span class="type">Thread</span> consumer = <span class="kw">new</span> <span class="type">Thread</span>(() -> {
    <span class="kw">while</span> (<span class="kw">true</span>) {
        <span class="type">Integer</span> val = queue.<span class="fn">take</span>(); <span class="cmt">// blocks if queue empty</span>
        <span class="type">System</span>.out.<span class="fn">println</span>(<span class="str">"Consumed: "</span> + val);
    }
});
producer.<span class="fn">start</span>(); consumer.<span class="fn">start</span>();`)}` },
  { title:'LRU Cache using LinkedHashMap', body:`<p>A Least Recently Used (LRU) Cache discards oldest items first when full. <code>LinkedHashMap</code> supports an <code>accessOrder</code> flag and <code>removeEldestEntry</code> override for a clean implementation.</p>
${codeBlock('Java',`<span class="kw">public class</span> <span class="type">LRUCache</span>&lt;<span class="type">K</span>, <span class="type">V</span>&gt; <span class="kw">extends</span> <span class="type">LinkedHashMap</span>&lt;<span class="type">K</span>, <span class="type">V</span>&gt; {
    <span class="kw">private final int</span> capacity;

    <span class="kw">public</span> <span class="type">LRUCache</span>(<span class="kw">int</span> capacity) {
        <span class="kw">super</span>(capacity, <span class="num">0.75f</span>, <span class="kw">true</span>);  <span class="cmt">// accessOrder=true!</span>
        <span class="kw">this</span>.capacity = capacity;
    }

    <span class="ann">@Override</span>
    <span class="kw">protected boolean</span> <span class="fn">removeEldestEntry</span>(<span class="type">Map.Entry</span>&lt;<span class="type">K</span>,<span class="type">V</span>&gt; eldest) {
        <span class="kw">return</span> <span class="fn">size</span>() > capacity; <span class="cmt">// auto-evict when full</span>
    }
}

<span class="type">LRUCache</span>&lt;<span class="type">Integer</span>,<span class="type">String</span>&gt; cache = <span class="kw">new</span> <span class="type">LRUCache</span>&lt;&gt;(<span class="num">3</span>);
cache.<span class="fn">put</span>(<span class="num">1</span>,<span class="str">"A"</span>); cache.<span class="fn">put</span>(<span class="num">2</span>,<span class="str">"B"</span>); cache.<span class="fn">put</span>(<span class="num">3</span>,<span class="str">"C"</span>);
cache.<span class="fn">get</span>(<span class="num">1</span>);      <span class="cmt">// access 1 → moves to end</span>
cache.<span class="fn">put</span>(<span class="num">4</span>,<span class="str">"D"</span>);  <span class="cmt">// evicts key 2 (least recently used)</span>`)}` }
]});

document.getElementById('dynamic-content').insertAdjacentHTML('beforeend', cats3.map(renderCategory).join(''));
