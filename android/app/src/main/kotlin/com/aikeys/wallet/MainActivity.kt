
package com.aikeys.wallet

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.util.Log
import android.view.KeyEvent
import android.webkit.*
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {
    
    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var offlineLayout: LinearLayout
    private lateinit var retryButton: Button
    private lateinit var offlineMessage: TextView
    
    companion object {
        private const val TAG = "AIKEYSWallet"
        private const val BASE_URL = BuildConfig.AIKEYS_BASE_URL
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        initViews()
        setupWebView()
        setupSwipeRefresh()
        setupOfflineRetry()
        
        // Handle deep links
        handleIntent(intent)
        
        // Load the main URL
        loadMainUrl()
        
        Log.d(TAG, "AIKEYS Wallet started - ${BuildConfig.AIKEYS_VERSION_INFO}")
    }
    
    private fun initViews() {
        webView = findViewById(R.id.webView)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        offlineLayout = findViewById(R.id.offlineLayout)
        retryButton = findViewById(R.id.retryButton)
        offlineMessage = findViewById(R.id.offlineMessage)
    }
    
    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            cacheMode = WebSettings.LOAD_DEFAULT
            useWideViewPort = true
            loadWithOverviewMode = true
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false
        }
        
        webView.webViewClient = AIKEYSWebViewClient()
        webView.webChromeClient = AIKEYSWebChromeClient()
        
        // Enable file downloads
        webView.setDownloadListener { url, userAgent, contentDisposition, mimeType, contentLength ->
            downloadFile(url, contentDisposition, mimeType)
        }
    }
    
    private fun setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener {
            webView.reload()
        }
    }
    
    private fun setupOfflineRetry() {
        retryButton.setOnClickListener {
            if (isNetworkAvailable()) {
                showWebView()
                webView.reload()
            } else {
                offlineMessage.text = "Still no internet connection. Please check your network settings."
            }
        }
    }
    
    private fun loadMainUrl() {
        if (isNetworkAvailable()) {
            webView.loadUrl(BASE_URL)
        } else {
            showOfflineScreen()
        }
    }
    
    private fun handleIntent(intent: Intent?) {
        intent?.data?.let { uri ->
            when (uri.scheme) {
                "aikeys" -> {
                    val path = uri.host + uri.path
                    webView.loadUrl("$BASE_URL/$path")
                }
                "https" -> {
                    if (uri.host == "aikeys-hub.com") {
                        webView.loadUrl(uri.toString())
                    }
                }
            }
        }
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }
    
    private fun downloadFile(url: String, contentDisposition: String?, mimeType: String?) {
        try {
            val request = DownloadManager.Request(Uri.parse(url)).apply {
                setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI or DownloadManager.Request.NETWORK_MOBILE)
                setAllowedOverRoaming(false)
                setTitle("AIKEYS Download")
                setDescription("Downloading file...")
                setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, 
                    URLUtil.guessFileName(url, contentDisposition, mimeType))
                setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            }
            
            val downloadManager = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            downloadManager.enqueue(request)
        } catch (e: Exception) {
            Log.e(TAG, "Download failed", e)
        }
    }
    
    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
        return capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
               capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) ||
               capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)
    }
    
    private fun showWebView() {
        webView.visibility = android.view.View.VISIBLE
        offlineLayout.visibility = android.view.View.GONE
    }
    
    private fun showOfflineScreen() {
        webView.visibility = android.view.View.GONE
        offlineLayout.visibility = android.view.View.VISIBLE
        offlineMessage.text = "No internet connection. Please check your network and try again."
    }
    
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }
    
    private inner class AIKEYSWebViewClient : WebViewClient() {
        
        override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
            val url = request?.url?.toString() ?: return false
            
            // Handle external links
            if (!url.startsWith(BASE_URL) && !url.startsWith("aikeys://")) {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                startActivity(intent)
                return true
            }
            
            return false
        }
        
        override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
            super.onPageStarted(view, url, favicon)
            swipeRefreshLayout.isRefreshing = true
        }
        
        override fun onPageFinished(view: WebView?, url: String?) {
            super.onPageFinished(view, url)
            swipeRefreshLayout.isRefreshing = false
            showWebView()
        }
        
        override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
            super.onReceivedError(view, request, error)
            swipeRefreshLayout.isRefreshing = false
            
            if (request?.isForMainFrame == true) {
                showOfflineScreen()
            }
        }
    }
    
    private inner class AIKEYSWebChromeClient : WebChromeClient() {
        
        override fun onProgressChanged(view: WebView?, newProgress: Int) {
            super.onProgressChanged(view, newProgress)
            swipeRefreshLayout.isRefreshing = newProgress < 100
        }
        
        // Handle file upload
        override fun onShowFileChooser(
            webView: WebView?,
            filePathCallback: ValueCallback<Array<Uri>>?,
            fileChooserParams: FileChooserParams?
        ): Boolean {
            // This would handle file uploads if needed
            return super.onShowFileChooser(webView, filePathCallback, fileChooserParams)
        }
    }
}
